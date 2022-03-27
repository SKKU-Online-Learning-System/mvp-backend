import express from 'express';
import multer from 'multer';
import path from 'path'
import { isLoggedIn } from '../passport/middleware';

import { DB_promisePool as db, stat } from './../configs'


// express
const lectures = express.Router();

// multer config
const storage = multer.diskStorage({
    destination: '../uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.fieldname + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    console.log(req);
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
        cb(null, false);
    }
    cb(null, true);
}

const upload = multer({storage: storage, fileFilter: fileFilter});

lectures.get('/upload/:courseId', (req, res, next) => {
    res.render('upload', { title: 'Upload' });
});

/**
 * lecture upload api (create)
 */
lectures.post('/upload/:courseId', upload.single('video'), async (req, res) => {
    try {
        const path = "../uploads/" + req.file.filename;
        const { courseId } = req.params;

        const dml = 'INSERT INTO lecture(title, filename, course_id, created_at) VALUES(?, ?, ?, ?, NOW())';
        const params = [req.body.title, req.file.filename, courseId];
        const [ { affectedRows } ] = await db.query(dml, params);

        if (affectedRows === 1) {
			return res.status(200).json({success:true});
		} else {
			return res.json(stat(500, 'The command has not been executed.'));
		}
    } catch(err) {
        res.json(stat(500, err.message));
    }
});

lectures.get('/:lectureId', async (req, res) => {
    const { lectureId } = req.params;

    if (isNaN(lectureId)) {
        return res.json(stat(400, 'Lecture id must be integer.'));
    }

    try {
		const [{ filename }] = await db.query('SELECT filename FROM lecture WHERE id=?', [lectureId]);

		if (filename) {
			return res.status(200).json({path: 'uploads/' + filename});
		} else {
			return res.json(stat(400, 'Lecture id doesn\'t exists.'));
		}
	} catch (err) {
		return res.json(stat(500, err.message));
	}

})

lectures.delete('/:lectureId', async (req, res) => {
    const { lectureId } = req.params;
    
    if (isNaN(lectureId)) {
        return res.json(stat(400, 'Lecture id must be integer.'));
    }

    try {
		const [{ affectedRows }] = await db.query('DELETE FROM lecture WHERE id=?', [lectureId]);

		if (affectedRows === 1) {
			return res.json(stat(200, 'Deleted'));
		} else {
			return res.json(stat(500, 'The command has not been executed.')); // DB에 쿼리를 성공적으로 보냈는데 지워진 게 없는 경우
		}
	} catch (err) {
		return res.json(stat(500, err.message));
	}
})


export default lectures;