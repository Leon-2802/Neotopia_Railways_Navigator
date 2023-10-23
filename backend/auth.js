import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { createRequire } from "module";
import { getUser } from './database.js';

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


app.post('/login', async (req, res) => {
    const { username, password, remember } = req.body;
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

    let refreshTokenLifetime = new Date();
    if (remember) {
        refreshTokenLifetime.setMonth(refreshTokenLifetime.getMonth() + 2); // 2 months later
    } else {
        refreshTokenLifetime = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)); // 24 hours later
    }

    res.status(200).cookie("access_token", accessToken, { httpOnly: true, sameSite: "strict" })
        .cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "strict", expires: refreshTokenLifetime })
        .json({ message: 'login successful' });
});

app.post('/token', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken == null) return res.sendStatus(401);

    jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "strict" })
            .json({ message: 'access token successfuly updated' });
    });
});

app.post('/authorize', async (req, res) => {
    const accessToken = req.cookies.access_token;
    if (accessToken == null) return res.sendStatus(401);

    jsonwebtoken.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.sendStatus(204);
    });
});

app.post('/logout', async (req, res) => {
    res.status(204).clearCookie("access_token", { httpOnly: true, sameSite: "strict" })
        .clearCookie("refresh_token", { httpOnly: true, sameSite: "strict" })
        .json({ message: 'session logged out' });
});



function generateAccessToken(user) {
    return jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

app.listen(8081, () => {
    console.log('Auth server running on port 8081')
});