import bcrypt from 'bcrypt';
import express from 'express';
import { createUser, getTrainsScheduledTable, getUser, getUsers } from './database.js';


const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.send(users);
});

app.get('/users/:username', async (req, res) => {
    const username = req.params.username;
    const user = await getUser(username);
    res.send(user);
});

app.post('/users', async (req, res) => {
    const { username, password } = req.body; // grab user data from http request
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
    const user = await createUser(username, password);
    res.status(201).send(user); // 201 = successfully created
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong')
});

app.listen(8080, () => {
    console.log('Server running on port 8080')
});