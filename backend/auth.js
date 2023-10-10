import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { createUser, deleteRemeberMeVerifier, getRefreshToken, getRemeberMeVerifier, getRememberedUsers, getUser, getUsers, storeRefreshToken, storeRemeberMeVerifier, updateRefreshToken, updateRemeberMeVerifier } from './database.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // wildcard origin - probably not safe to use?
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
    next();
});


app.post('/signup', async (req, res) => {
    const { username, password } = req.body; // grab user data from http request
    const hash = await bcrypt.hash(password, 13);
    await createUser(username, hash);
    res.status(201).send(`user "${username}" successfully created`); // 201 = successfully created
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
    // store refresh token in db
    if (await getRefreshToken(username)) {
        await updateRefreshToken(username, refreshToken);
        console.log("updated refresh token");
    } else {
        await storeRefreshToken(username, refreshToken);
    }

    // res.status(200).send("login successful");
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.post('/token', async (req, res) => {
    const { username, refreshToken } = req.body;
    if (username == null || refreshToken == null) return res.sendStatus(401);
    const dbRefreshToken = await getRefreshToken(username);
    if (dbRefreshToken == null) return res.sendStatus(403);
    jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.json({ accessToken: accessToken });
    });
});


function generateAccessToken(user) {
    return jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(8081, () => {
    console.log('Auth server running on port 8081')
});