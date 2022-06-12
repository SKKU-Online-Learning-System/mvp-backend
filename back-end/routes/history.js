import express from 'express';

import { DB_promisePool as db, stat } from './../configs';

// express
const history = express.Router();

history.post('/', async (req, res) => {
	const { userId, courseId, lastTime } = req.body
    
    try {
        await db.query(
          'INSERT INTO history(user_id, lecture_id, last_time) VALUES (?, ?, ?)',
          [userId, courseId, lastTime]
        );
        return res.json(stat(201, "success"));
    } catch (err) {
        return res.json(stat(500, err.message));
    }
});

export default history;
