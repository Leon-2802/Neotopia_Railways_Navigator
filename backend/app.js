import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { createRequire } from "module";
import { createUser, deleteUser, getTrainsScheduledTable, getUser, getUsers, setTrainsScheduled } from './database.js';

dotenv.config();
const require = createRequire(import.meta.url);
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:4200',
        credentials: true
    })
);


// user management ----------------------------------------------------
app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.send(users);
});

app.get('/users/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const user = await getUser(username);
        res.send(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`user ${username} not found`);
    }
});

app.post('/delete_user', authenticateToken, async (req, res) => {
    const { username } = req.body;
    try {
        await getUser(username);
        await deleteUser(username);
        res.status(204).send(`user "${username}" deleted`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`user: "${username}" doesn't exist`);
    }
});
//  -------------------------------------------------------------------

// train stuff --------------------------------------------------------
app.get('/trains_scheduled', authenticateToken, async (req, res) => {
    const [result] = await getTrainsScheduledTable();
    res.send(result);
});
app.post('/set_trains_scheduled', authenticateToken, async (req, res) => {
    const { date } = req.body;
    try {
        await setTrainsScheduled(date);
        res.status(200).send(`date successfully updated to ${date}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.sqlMessage);
    }
});
//  -------------------------------------------------------------------

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong')
});

app.listen(8080, () => {
    console.log('Server running on port 8080')
});


// auth functions
function authenticateToken(req, res, next) {
    const token = req.cookies.access_token;
    if (token == null) return res.sendStatus(401);

    jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}