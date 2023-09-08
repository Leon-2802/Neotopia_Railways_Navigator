// https://www.youtube.com/watch?v=Hej48pi_lOc  
// 19:45

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
    const result = await pool.query("SELECT * FROM users");
    return result;
}

export async function getUser(username) {
    const [rows] = await pool.query(`
    SELECT * FROM users
    WHERE username = ?
    `, [username])
    return rows[0]; // cleaner result without the array stuff around it
}

export async function createUser(username, password) {
    const result = await pool.query(`
    INSERT INTO users (Username,Password)
    VALUES (?, ?)
    `, [username, password]);
    return getUser(username);
}

const users = await getUsers();
const testuser = await getUser('testtyp02');
// const result = await createUser('testtyp04', 'ggerge');
console.log(testuser);