import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { getUser } from './database.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // wildcard origin - probably not safe to use?
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Authorization");
    next();
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userResponse = await getUser(username);
    if (!userResponse) {
        res.status(500).send(`user "${username}" not found`);
        return;
    }
    const passwordValid = await bcrypt.compare(password, userResponse.Password);
    if (!passwordValid) {
        res.status(401).send("wrong password");
        return;
    }

    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jsonwebtoken.sign(user, process.env.REFRESH_TOKEN_SECRET);

    res.json({ accessToken: accessToken, refreshToken: refreshToken, message: 'login successful' });
});

app.post('/token', async (req, res) => {
    const { username, refreshToken } = req.body;
    if (username == null || refreshToken == null) return res.sendStatus(401);
    jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    });
});

app.post('/authorize', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    if (accessToken == null) return res.sendStatus(401);

    jsonwebtoken.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.sendStatus(204);
    });
});

function generateAccessToken(user) {
    return jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

app.listen(8081, () => {
    console.log('Auth server running on port 8081')
});