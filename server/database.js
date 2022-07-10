import 'dotenv/config';
import pg from 'pg';

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
                OID integer primary key,
                Name varchar(50),
                url text,
                mission text,
                country varchar(3)
            );
            create table if not exists users (
                UID varchar(30) primary key,
                Password varchar(30)
            );
            create table if not exists likes (
                UID varchar(30) primary key,
                OID integer
            )
        `;
        const res = await this.client.query(queryText);
    }

    // TODO CREATE METHODS TO INTERACT WITH DATABASE ONCE STRUCTURE DECIDED
}

export { Database };