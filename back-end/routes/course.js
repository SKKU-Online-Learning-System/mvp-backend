import express from 'express';

import { DB_promisePool as db, Err, statusJson } from './../configs'


// express
const router = express.Router();

/*
* Course Lookup API
* Using Query string 
* TODO: apply async await on db query
*/ 
router.get('/', async (req, res) => {
	const pageInfo = req.query;

	const pageNum = parseInt(pageInfo.page) || 1; // pageNum, default pageNum=1
	const pageSize = parseInt(pageInfo.pageSize) || 24; // # of lectures to show, default pageSize=24
	const string = pageInfo.s; // search string, "undefined" or string
	const difficulty = (pageInfo.difficulty||'').split(',').filter(item => !Number.isNaN(parseInt(item))); // e.g.) 1,2,3 => [1,2,3]
	const cat1 = parseInt(pageInfo.cat1); // main category
	const cat2 = parseInt(pageInfo.cat2); // sub category

	console.log(string, difficulty, pageInfo.cat1, pageInfo.cat2);
	
	const isStrValid = typeof string != 'undefined';
	const isDiffValid = difficulty.length;
	const isCat1Valid = !Number.isNaN(cat1);
	const isCat2Valid = !Number.isNaN(cat2);

	const sqlCnt = 'SELECT count(*) as cnt FROM course ';
	const sqlResult = 'SELECT * FROM course ';
	
	let sql = '';
	let params = [];
	if (isStrValid || isDiffValid || isCat1Valid || isCat2Valid) sql += 'WHERE ';
	if (isStrValid) {
		sql += 'LOWER(name) like LOWER(?) ';
		params.push(string);
	}
	if (isDiffValid)  {
		if (isStrValid) sql += 'AND ';
		sql += 'difficulty in (?) ';
		params.push(difficulty);
	}
	if (isCat1Valid) {
		if (isStrValid || isDiffValid) sql += 'AND ';
		sql += 'cat1 in (SELECT id FROM cat1 WHERE name=?) ';
		params.push(cat1);
	}
	if (isCat2Valid) {
		if (isStrValid || isDiffValid || isCat1Valid) sql += 'AND ';
		sql += 'cat2 in (SELECT id FROM cat2 WHERE name=?) ';
		params.push(cat2);
	}
	const sqlLimit = `LIMIT ${(pageNum-1)*pageSize},${pageSize}`;
	// console.log(isStrValid, isDiffValid, isCat1Valid, isCat2Valid);
	// console.log('1st sql: ', sqlCnt + sql);
	// console.log('2nd sql: ', sqlResult + sql + sqlLimit);
	// console.log('params', params);

	try {
		const [totalCnt] = await db.query(sqlCnt+sql, params);
		const [results] = await db.query(sqlResult+sql+sqlLimit, params);
		const pageCnt = Math.ceil(totalCnt[0].cnt/pageSize);
		return res.json(statusJson(200, {"pageCnt": pageCnt, "records": results}));

	} catch(err) {
		return res.json(Err(err.message));
	}
});


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