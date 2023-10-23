import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { createRequire } from "module";
import { deleteUser, getTrainsScheduledTable, getUser, getUsers } from './database.js';

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
    const user = await getUser(username);
    res.send(user);
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body; // grab user data from http request
    const hash = await bcrypt.hash(password, 13);
    await createUser(username, hash);
    res.status(201).send(`user "${username}" successfully created`); // 201 = successfully created
});

app.post('/delete_user', authenticateToken, async (req, res) => {
    const { username } = req.body;
    await deleteUser(username);
    res.status(204).send(`user "${username}" deleted`);
});
//  -------------------------------------------------------------------

// train stuff --------------------------------------------------------
app.get('/trains_scheduled', authenticateToken, async (req, res) => {
    const [result] = await getTrainsScheduledTable();
    res.send(result);
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