import express from 'express';
import crypto from 'crypto';
import passport from 'passport';

import { DB_promisePool as db, hashSettings, stat } from './../configs';
import { isLoggedIn, isNotLoggedIn } from '../passport/middleware';


// express
const auth = express.Router();

// 회원가입
auth.post('/join', async (req, res) => {
	const { email, password, name, sex, phone, birth, description } = req.body;

	const salt = crypto.randomBytes(hashSettings.keylen).toString(hashSettings.encoding);
	const key = crypto.pbkdf2Sync(password, salt, hashSettings.iterations, hashSettings.keylen, hashSettings.digest).toString(hashSettings.encoding);

	try {
		await db.query(
			'INSERT INTO user(email, password, name, sex, phone, birth, joined, description, salt) VALUES(?, ?, ?, ?, ?, ?, NOW(), ?, ?)',
			[email, key, name, sex, phone, birth, description, salt],
		);
		return res.json(stat(201));
	} catch (err) {
		return res.json(stat(500, err.message));
	}
});

// 아이디 중복체크
auth.get('/emailCheck/:email', async (req, res) => {
	const { email } = req.params;

	try {
		const result = await db.query('SELECT id FROM user WHERE email=?', [email]);
	
		if (result.length == 0) {
			return res.json(stat(200));
		} else {
			return res.json(stat(409));
		}
	} catch (err) {
		return res.json(stat(500, err.message));
	}
});

/*
* Local login API using passport
* Using Query string 
*/ 
auth.post('/login', isNotLoggedIn, (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if(err) return next(err);
		if(!user) return res.json(stat(400, 'login failed'));
		return res.json(stat(200, req.body.email + ' login success'));
	}) (req, res, next);
});

// auth.post('/login', isNotLoggedIn, passport.authenticate('local', {
// 	successRedirect: '/',
// 	failureRedirect: '/login',
// 	failureMessage: true
// }));

/*
* logout API
*/ 
auth.get('/logout', isLoggedIn, (req, res) => {
	req.logout();
	res.redirect('/');
});

export default auth;
