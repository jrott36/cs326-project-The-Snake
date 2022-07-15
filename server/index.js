import { Database } from "./database.js";
import 'dotenv/config';
import logger from 'morgan';
import express, { Router } from 'express';
import expressSession from 'express-session';
import auth from './auth.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const database = new Database();
await database.connect();
await database.init();

const app = express();
const port = process.env.PORT || 3000;

const sessionConfig = {
    secret: process.env.SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false,
};

app.use(expressSession(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger('dev'));

auth.configure(app);

const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/', checkLoggedIn, (req, res) => {
    res.sendFile('client/index.html', {root: __dirname});
});

app.use(express.static('client'));

app.get('/login', (req, res) => {
    res.sendFile('client/login.html', {root: __dirname});
});

app.post(
    '/login',
    auth.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    })
  );

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
    });
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.sendFile('client/register.html', {root: __dirname});
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const success = await database.addUser(username, password);
        if (success) {
            res.redirect('/login');
        } else {
            res.redirect('/register');
        }
    } catch (err) {
        res.redirect('/register');
    }
});

app.post('/search', checkLoggedIn, async (req, res) => {
    try {
        const body = req.body;
        const results = await database.searchFor(body.search);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({'status': 'failed'});
    }
});

app.post('/like', checkLoggedIn, async (req, res) => {
    try {
        const body = req.body;
        await database.addLike(body.OID, req.user);
        res.status(200);
    } catch (err) {
        res.status(500).json({'status': 'failed'});
    }
});

app.delete('/removeLike', checkLoggedIn, async (req, res) => {
    try {
        const body = req.body;
        await database.removeLike(body.OID, req.user);
        res.status(200)
    } catch (err) {
        res.status(500).json({'status': 'failed'});
    }
});

app.get('/liked', checkLoggedIn, async (req, res) => {
    try {
        const results = await database.getUserLikes(req.user);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({'status': 'failed'});
    }
});

// Redirect everything else
app.all('*', async (request, response) => {
    response.status(404).send(`Request not found: ${request.path}`);
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});