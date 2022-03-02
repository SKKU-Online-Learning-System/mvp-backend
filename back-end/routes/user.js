import express from 'express';

import { DB_promisePool as db, stat } from '../configs';

// express
const users = express.Router();

/* GET users listing. */
users.get('/', function (req, res) {
	res.send('respond with a resource');
});

users.get('/profile', (req, res) => {
	res.send('user profile inquiry page');
});

users.post('/update', (req, res) => {
	res.send('user profile update page');
});

export default users;
