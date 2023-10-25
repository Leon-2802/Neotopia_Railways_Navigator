import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const pool = mysql.createPool({  // creates pool of connections
    host: process.env.MYSQL_HOST, //environment variable -> hide sensitive information and prevent hard-coding
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise(); // allows to use async methods with promises over callbacks (?)



// user-management ----------------------------------------------------------------
export async function getUsers() {
    const [result] = await pool.query("SELECT * FROM users");
    return result;
}

async function getUserId(username) {
    const [id] = await pool.query(`
    SELECT id FROM users
    WHERE username = ?
    `, [username]);
    return id[0].id; // cleaner result without the array stuff around it
}

export async function getUser(username) {
    const userId = await getUserId(username);
    const [user] = await pool.query(`
    SELECT * FROM users 
    WHERE id = ?
    `, [userId]);
    return user[0];
}

export async function createUser(username, email, password) {
    await pool.query(`
    INSERT INTO users (username, email, password, confirmed)
    VALUES (?, ?, ?, ?)
    `, [username, email, password, 0]);
    return getUser(username);
}

export async function confirmUser(username) {
    await pool.query(`
    UPDATE users 
    SET confirmed = ?
    WHERE username = ?
    `, [1, username]);
}

export async function deleteUser(username) {
    await pool.query(`
    DELETE FROM users 
    WHERE username = ?
    `, [username]);
}
// -----------------------------------------------------------------------------


export async function getTrainsScheduledTable() {
    const [rows] = await pool.query("SELECT * FROM trains_scheduled");
    return rows;
}
export async function setTrainsScheduled(newDate) {
    await pool.query(`
    UPDATE trains_scheduled
    SET LastDate = ?
    WHERE ID = ?
    `, [newDate, 0]);
}