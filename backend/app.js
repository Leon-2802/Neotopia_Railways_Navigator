import bcrypt from 'bcryptjs';
import express from 'express';
import { createUser, getTrainsScheduledTable, getUser, getUsers } from './database.js';


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
        res.send(`user "${username}" not found`);
        return;
    }
    const passwordValid = await bcrypt.compare(password, userResponse.Password);
    if (!passwordValid) {
        res.send("wrong password");
        return;
    }

    res.send("Login successful");
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong')
});

app.listen(8080, () => {
    console.log('Server running on port 8080')
});