import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const pool = mysql.createPool({  // creates pool of connections
    host: process.env.MYSQL_HOST, //environment variable -> hide sensitive information and prevent hard-coding
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise(); // allows to use async methods with promises over callbacks (?)


export async function getTrainsScheduledTable() {
    const [rows] = await pool.query("SELECT * FROM trains_scheduled");
    return rows;
}

export async function getUsers() {
    const [result] = await pool.query("SELECT * FROM users");
    return result;
}

export async function getUser(username) {
    const [rows] = await pool.query(`
    SELECT * FROM users
    WHERE username = ?
    `, [username])
    return rows[0]; // cleaner result without the array stuff around it
}

export async function getRememberedUsers() {
    const [result] = await pool.query("SELECT * FROM remember_users");
    return result;
}

export async function createUser(username, password) {
    await pool.query(`
    INSERT INTO users (Username,Password)
    VALUES (?, ?)
    `, [username, password]);
    return getUser(username);
}

export async function storeRemeberMeVerifier(username, verifier) {
    await pool.query(`
    INSERT INTO remember_users (username,verifier)
    VALUES (?, ?)
    `, [username, verifier]);
    return getRemeberMeVerifier(username);
}

export async function getRemeberMeVerifier(username) {
    const [rows] = await pool.query(`
    SELECT * FROM remember_users
    WHERE username = ?
    `, [username]);
    return rows[0];
}

export async function updateRemeberMeVerifier(username, verifier) {
    await pool.query(`
    UPDATE remember_users 
    SET verifier = ?
    WHERE username = ?
    `, [verifier, username]);
    return getRemeberMeVerifier(username);
}

export async function deleteRemeberMeVerifier(username) {
    await pool.query(`
    DELETE FROM remember_users
    WHERE username = ?
    `, [username]);
    return `verifier for ${username} deleted`;
}