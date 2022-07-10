import { Database } from "./database.js";
import logger from 'morgan';
import express from 'express';

const database = new Database();
await database.connect();
await database.init();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({exntended: false}));
app.use(logger('dev'));
app.use('/', express.static('client'));

// TODO Implement the endpoints

// Redirect everything else
app.all('*', async (request, response) => {
    response.status(404).send(`Request not found: ${request.path}`);
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})