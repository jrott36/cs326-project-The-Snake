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

    // TODO CREATE METHODS TO INTERACT WITH DATABASE ONCE STRUCTURE DECIDED

    async searchFor(str){
        const queryText = 'SELECT * FROM orgs WHERE Name LIKE $1 OR Mission LIKE $1 OR Country=$2 ORDER BY num_likes DESC';
        const res = await this.client.query(queryText, [('%' + str + '%'), str]);
        return res.rows;
    }

    async addLike(OID, num){
        // const queryText = 'INSERT INTO likes (UID, OID) VALUES ($1, $2)';
        const queryText = "UPDATE orgs SET num_likes = $1 WHERE OID = $2";
        await this.client.query(queryText, [num, OID]);
    }

    async removeLike(OID, num){
        // const queryText = `DELETE FROM likes WHERE UID=$1 AND OID=$2`;
        const queryText = "UPDATE orgs SET num_likes = $1 WHERE OID = $2";
        await this.client.query(queryText, [num, OID]);
    }
}

export { Database };