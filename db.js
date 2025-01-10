import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export async function connectToDatabase() {
    if (!db) {
        db = await open({
            filename: './database/fitness_data.db',
            driver: sqlite3.Database,
        });
    }
    return db;
}