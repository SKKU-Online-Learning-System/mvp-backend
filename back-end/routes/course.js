import express from 'express';

import { DB_promisePool as db, Err, statusJson } from './../configs'


// express
const router = express.Router();


router.get('/:courseId', async (req, res) => {
	const { courseId } = req.params;

	if (isNaN(courseId)) {
		return res.json(statusJson(400, 'Bad Request: Course id must be integer.'));
	}

	try {
		const [[ course ]] = await db.query('SELECT * FROM course WHERE id=?', [courseId]);

		if (course === undefined)
			return res.json(statusJson(400, 'Bad Request: Invalid course id.'));
		
		const queryInst = db.query('SELECT name FROM user WHERE id=?', [course.inst_id]);
		const queryCat1 = db.query('SELECT name FROM cat1 WHERE id=?', [course.cat1]);
		const queryCat2 = db.query('SELECT name FROM cat2 WHERE id=?', [course.cat2]);
		
		const [[[{name: instructor}], f1], [[{name: cat1}], f2], [[{name: cat2}], f3]] = await Promise.all([queryInst, queryCat1, queryCat2]);

		delete course.inst_id;
		course.instructor = instructor;
		course.cat1 = cat1;
		course.cat2 = cat2;

		// hashtag
		const [hash, f] = await db.query('SELECT tag FROM course_hashtag left join hashtag on hashtag_id=id where course_id=?', [course.id]);
		course.hashtag = hash.map(x => x.tag);

		// lecture
		course.lectures = '곧 추가될 예정입니다.';

		res.json(course);
	} catch (err) {
		return res.json(Err(err.message));
	}
});



export default router;