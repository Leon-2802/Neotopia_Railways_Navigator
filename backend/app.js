import bcrypt from 'bcryptjs';
import express from 'express';
import { createUser, deleteRemeberMeVerifier, getRemeberMeVerifier, getRememberedUsers, getTrainsScheduledTable, getUser, getUsers, storeRemeberMeVerifier, updateRemeberMeVerifier } from './database.js';


const app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // wildcard origin - probably not safe to use?
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
    next();
});

app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.send(users);
});

app.get('/users/:username', async (req, res) => {
    const username = req.params.username;
    const user = await getUser(username);
    res.send(user);
});

app.get('/remembered_users', async (req, res) => {
    const rememberedUsers = await getRememberedUsers();
    res.send(rememberedUsers);
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

    res.status(200).send("login successful");
});

app.post('/store_remember_user', async (req, res) => {
    const { username, verifier } = req.body;
    const hash = await bcrypt.hash(verifier, 13);
    await storeRemeberMeVerifier(username, hash);
    res.status(201).send(`user "${username}" will be remembered`);
});

app.post('/check_remember_user', async (req, res) => {
    const { username, verifier } = req.body;
    const getVerifier = await getRemeberMeVerifier(username);
    if (!verifier) {
        res.status(500).send(`no verifier for "${username}"`);
        return;
    }
    const verifierValid = await bcrypt.compare(verifier, getVerifier.verifier);
    if (!verifierValid) {
        res.status.send(401).send("wrong verifier");
        return;
    }

    res.status(200).send("remember me verification successful");
});

app.post('/update_remember_user', async (req, res) => {
    const { username, verifier } = req.body;
    // doesn't need to double check -> only called after verification (probably not safe enough though...)
    const hash = await bcrypt.hash(verifier, 13);
    await updateRemeberMeVerifier(username, hash);
    res.status(201).send(`verifier of user "${username}" has been updated`);
});

app.post('/delete_remember_user', async (req, res) => {
    const { username, verifier } = req.body;
    const getVerifier = await getRemeberMeVerifier(username);
    if (!verifier) {
        res.status(500).send(`no verifier for "${username}"`);
        return;
    }
    const verifierValid = await bcrypt.compare(verifier, getVerifier.verifier);
    if (!verifierValid) {
        res.status.send(401).send("wrong verifier");
        return;
    }

    await deleteRemeberMeVerifier(username);
    res.status(200).send(`verifier of user "${username}" has been deleted`);
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong')
});

app.listen(8080, () => {
    console.log('Server running on port 8080')
});