import express from 'express';

import { DB_promisePool as db, stat } from './../configs';

// express
const courses = express.Router();

/*
* Course Lookup API
* Using Query string 
*/ 
courses.get('/', async (req, res) => {
	const pageInfo = req.query;

	const pageNum = parseInt(pageInfo.page) || 1; // pageNum, default pageNum=1
	const pageSize = parseInt(pageInfo.pageSize) || 24; // # of lectures to show, default pageSize=24
	const string = pageInfo.s; // search string, "undefined" or string
	const difficulty = (pageInfo.difficulty||'').split(',').filter(item => !Number.isNaN(parseInt(item))); // e.g.) 1,2,3 => [1,2,3]
	const cat1 = pageInfo.cat1; // main category
	const cat2 = pageInfo.cat2; // sub category

	console.log(string, difficulty, pageInfo.cat1, pageInfo.cat2);
	
	const isStrValid = typeof string != 'undefined';
	const isDiffValid = difficulty.length;
	const isCat1Valid = typeof cat1 != 'undefined';
	const isCat2Valid = typeof cat2 != 'undefined';

	const sqlCnt = 'SELECT count(*) as cnt FROM course ';
	const sqlResult = 'SELECT course.id, course.title, course.description, course.difficulty, course.thumbnail, course.created_at FROM course ';
	
	let sql = '';
	let params = [];
	if (isStrValid || isDiffValid || isCat1Valid || isCat2Valid) sql += 'WHERE ';
	if (isStrValid) {
		sql += 'LOWER(title) like LOWER(?) ';
		params.push('%'+string+'%');
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
	const sqlLimit = `LIMIT ${(pageNum-1)*pageSize}, ${pageSize}`;
	console.log(isStrValid, isDiffValid, isCat1Valid, isCat2Valid);
	console.log('1st sql: ', sqlCnt + sql);
	console.log('2nd sql: ', sqlResult + sql + sqlLimit);
	console.log('params', params);

	try {
		const [totalCnt] = await db.query(sqlCnt+sql, params);
		const [results] = await db.query(sqlResult+sql+sqlLimit, params);
		const pageCnt = Math.ceil(totalCnt[0].cnt/pageSize);
		return res.json({"pageCnt": pageCnt, "records": results});

	} catch(err) {
		return res.json(stat(500, err.message));
	}
});


// // 모든 강의 조회
// courses.get('/', async (req, res) => {
// 	try {
// 		const [result, f] = await db.query('SELECT * FROM course');
// 		return res.json(result);
// 	} catch (err) {
// 		return res.json(stat(500, err.message));
// 	}
// })

// 강의 생성
courses.post('/', async (req, res) => {
	const { title, description, instructorId, category1, category2, difficulty } = req.body;
	const thumbnail = 'no thumbnail'; // TODO 썸네일은 서버에 저장하고 DB에는 url 저장

	try {
		await db.query(
			'INSERT INTO course(title, description, inst_id, cat1, cat2, thumbnail, difficulty) VALUES(?, ?, ?, ?, ?, ?, ?)',
			[title, description, instructorId, category1, category2, thumbnail, difficulty]
		);
		return res.json(stat(201));
	} catch (err) {
		return res.json(stat(500, err.message));
	}
});

// 상위 카테고리 조회
courses.get('/cat1', async (req, res) => {
	try {
		const [cat, f] = await db.query('SELECT * FROM cat1');
		return res.json(cat);
	} catch (err) {
		return res.json(stat(500, err.message));
	}
});

// 하위 카테고리 조회
courses.get('/cat2', async (req, res) => {
	try {
		const [cat, f] = await db.query('SELECT * FROM cat2');
		return res.json(cat);
	} catch (err) {
		return res.json(stat(500, err.message));
	}
});

// 강의 조회
courses.get('/:courseId', async (req, res) => {
	const { courseId } = req.params;

	if (isNaN(courseId)) {
		return res.json(stat(400, 'Course id must be integer.'));
	}

	try {
		const [[course]] = await db.query('SELECT * FROM course WHERE id=?', [courseId]);

		if (course === undefined) {
			return res.json(stat(400, 'Invalid course id.'));
		}

		const queryInst = db.query('SELECT name FROM user WHERE id=?', [course.inst_id]);
		const queryCat1 = db.query('SELECT name FROM cat1 WHERE id=?', [course.cat1]);
		const queryCat2 = db.query('SELECT name FROM cat2 WHERE id=?', [course.cat2]);

		const [
			[[{ name: instructor }], f1],
			[[{ name: cat1 }], f2],
			[[{ name: cat2 }], f3],
		] = await Promise.all([queryInst, queryCat1, queryCat2]);

		delete course.inst_id;
		delete course.cat1;
		delete course.cat2;
		course.instructor = instructor;
		course.category1 = cat1;
		course.category2 = cat2;

		// hashtag
		const [hash, f] = await db.query('SELECT tag FROM course_hashtag left join hashtag on hashtag_id=id where course_id=?', [course.id]);
		course.hashtag = hash.map((x) => x.tag);

		// lecture
		course.lectures = '곧 추가될 예정입니다.';

		return res.json(course);
	} catch (err) {
		return res.json(stat(500, err.message));
	}
});

// 강의 수정
courses.put('/:courseId', async (req, res) => {
	const { courseId } = req.params;
	const { title, description, category1, category2, difficulty } = req.body;
	const thumbnail = 'no thumbnail'; // TODO 썸네일은 서버에 저장하고 DB에는 url 저장

	if (isNaN(courseId)) {
		return res.json(stat(400, 'Course id must be integer.'));
	}

	try {
		await db.query(
			'UPDATE course SET title=?, description=?, cat1=?, cat2=?, thumbnail=?, difficulty=? WHERE id=?',
			[title, description, category1, category2, thumbnail, difficulty, courseId]
		);
		return res.json(stat(200, 'Updated'));
	} catch (err) {
		return res.json(stat(500, err.message));
	}
});

// 강의 삭제
courses.delete('/:courseId', async (req, res) => {
	const { courseId } = req.params;

	if (isNaN(courseId)) {
		return res.json(stat(400, 'Course id must be integer.'));
	}

	try {
		const [{ affectedRows }] = await db.query('DELETE FROM course WHERE id=?', [courseId]);

		if (affectedRows === 1) {
			return res.json(stat(200, 'Deleted'));
		} else {
			return res.json(stat(500, 'The command has not been executed.')); // DB에 쿼리를 성공적으로 보냈는데 지워진 게 없는 경우
		}
	} catch (err) {
		return res.json(stat(500, err.message));
	}
})




export default courses;
