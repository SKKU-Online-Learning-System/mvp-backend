import express from 'express';
import crypto from 'crypto';

import { DB_promisePool as db, hashSettings, Err, statusJson } from './../configs';


// express
const router = express.Router();



// 회원가입
router.post('/join', async (req, res) => {
	const { email, password, name, sex, phone, birth, desc } = req.body;

	const salt = crypto.randomBytes(hashSettings.keylen).toString(hashSettings.encoding);
	const key = crypto.pbkdf2Sync(password, salt, hashSettings.iterations, hashSettings.keylen, hashSettings.digest).toString(hashSettings.encoding);

	try {
		await db.query(
			'INSERT INTO user(email, password, name, sex, phone, birth, joined, description, salt) VALUES(?, ?, ?, ?, ?, ?, NOW(), ?, ?)',
			[email, key, name, sex, phone, birth, desc, salt],
		);
		return res.json(statusJson(201, 'Created'));
	} catch (err) {
		return res.json(Err(err.message));
	}
});

// 아이디 중복체크
router.get('/emailCheck/:email', async (req, res) => {
	const { email } = req.params;

	try {
		const result = await db.query('SELECT id FROM user WHERE email=?', [email]);
	
		if (result.length == 0) {
			return res.json(statusJson(200, 'OK'));
		} else {
			return res.json(statusJson(409, 'Conflict'));
		}
	} catch (err) {
		return res.json(Err(err.message));
	}
});



export default router;
