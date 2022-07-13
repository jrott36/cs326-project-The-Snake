import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

class Database {
    constructor() {
        this.dburl = process.env.DATABASE_URL;
    }

    async connect(){
        this.pool = new Pool({
            connectionString: this.dburl,
            ssl: {rejectUnauthorized: false},
        });
        this.client = await this.pool.connect();
    }

    async close(){
        this.client.release();
        await this.pool.end();
    }

    async init() {
        const queryText = `
            create table if not exists orgs (
                OID varchar(10) primary key,
                Name text,
                Url text,
                Mission text,
                Country varchar(3),
                num_likes integer
            );
            alter table orgs alter column num_likes set default 0;
            create table if not exists users (
                UID varchar(30) primary key,
                Password varchar(30)
            );
            create table if not exists likes (
                UID varchar(30) primary key,
                OID varchar(10)
            );
        `;
        await this.client.query(queryText);
    }

    async searchFor(str){
        const queryText = 'SELECT DISTINCT * FROM orgs WHERE UPPER(Name) LIKE UPPER($1) OR UPPER(Mission) LIKE UPPER($1) OR Country=UPPER($2) ORDER BY num_likes DESC';
        const res = await this.client.query(queryText, [('%' + str + '%'), str]);
        return res.rows;
    }

    async addLike(OID, UID, num){
        // const queryText = 'INSERT INTO likes (UID, OID) VALUES ($1, $2)';
        const queryText = "UPDATE orgs SET num_likes = $1 WHERE OID = $2";
        await this.client.query(queryText, [num, OID]);
    }

    async removeLike(OID, UID, num){
        // const queryText = `DELETE FROM likes WHERE UID=$1 AND OID=$2`;
        const queryText = "UPDATE orgs SET num_likes = $1 WHERE OID = $2";
        await this.client.query(queryText, [num, OID]);
    }

    async findUser(username){
        const queryText = "SELECT EXISTS(SELECT * FROM users WHERE UID=$1)";
        const res = await this.client.query(queryText, [username]);
        let temp = await res.rows[0]
        return temp.exists;
    }

    async addUser(username, password){
        const queryText = "INSERT INTO users (UID, Password) VALUES ($1, $2);";
        await this.client.query(queryText, [username, password]);
        return true;
    }

    async validatePassword(name, pwd){
        if (!this.findUser(name)) { return false; }
        const queryText = "SELECT EXISTS(SELECT * FROM users WHERE UID=$1 AND Password=$2)";
        const res = await this.client.query(queryText, [name, pwd]);
        let temp = await res.rows[0]
        return temp.exists;
    }
}

export { Database };