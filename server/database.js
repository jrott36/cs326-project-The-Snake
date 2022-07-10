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
            create table if not exists ______ (
                #### STRUCTURE ####
            )
        `;
        const res = await this.client.query(queryText);
    }

    // TODO CREATE METHODS TO INTERACT WITH DATABASE ONCE STRUCTURE DECIDED
}

export { Database };