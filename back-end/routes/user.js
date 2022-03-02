import express from 'express';

import { DB_promisePool as db, stat } from '../configs';

// express
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('respond with a resource');
});

router.get('/profile', (req, res) => {
	res.send('user profile inquiry page');
});

router.post('/update', (req, res) => {
	res.send('user profile update page');
});

export default router;
