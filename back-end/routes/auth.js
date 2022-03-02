import express from 'express';
import crypto from 'crypto';

import { DB_promisePool as db, hashSettings, stat } from './../configs';


// express
const router = express.Router();



// 회원가입
router.post('/join', async (req, res) => {
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
router.get('/emailCheck/:email', async (req, res) => {
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



export default router;
