import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const pool = mysql.createPool({  // creates pool of connections
    host: process.env.MYSQL_HOST, //environment variable -> hide sensitive information and prevent hard-coding
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise(); // allows to use async methods with promises over callbacks (?)


async function getTrainsScheduledTable() {
    const [rows] = await pool.query("SELECT * FROM trains_scheduled");
    return rows;
}

async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

const users = await getUsers();
console.log(users);