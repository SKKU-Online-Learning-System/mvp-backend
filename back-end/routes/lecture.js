import express from 'express';
import { unlink } from 'fs';
import multer from 'multer';
import path from 'path'
import { isLoggedIn } from '../passport/middleware';

import { DB_promisePool as db, stat } from './../configs'


// express
const lectures = express.Router();


/* JSON
*  fieldname: 'video',
*  originalname: '가나다.ts',
*  encoding: '7bit',
*  mimetype: 'video/vnd.dlna.mpeg-tts',
*  destination: '../uploads/',
*  filename: '1648953639568_video.ts',
*  path: '../uploads/1648953639568_video.ts',
*  size: 98822952
*/

// multer config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const suffix = Date.now() + '_';
        cb(null, suffix + file.fieldname + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    console.log('File extension name is ', ext);
    if (ext !== '.mp4') {
        console.log('Reject file upload');
        // cb(null, false);
        // 일단 에러 던지게는 했지만, json 형태로 리턴하게 만들어야 함.
        return cb(new Error('Please upload .mp4 files'));
    }
    console.log('File upload complete');
    cb(null, true);
}

const upload = multer({storage: storage, fileFilter: fileFilter});

lectures.get('/upload/:courseId', (req, res) => {
    res.render('upload', { title: 'Upload' });
});

/**
 * lecture upload api (create)
 */
// lectures.post('/upload/:courseId', upload.single('video'), async (req, res) => {
lectures.post('/upload/:courseId', upload.array('video'), async (req, res) => {
    try {
        const params = [];
        req.files.forEach((json) => {
            params.push([json.originalname, json.filename, req.params.courseId]);
        });

        const [ { affectedRows } ] = await db.query('INSERT INTO lecture (title, filename, course_id) VALUES ?', [params]);

        if (affectedRows !== 0) {
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
		const [[ {filename} ]] = await db.query('SELECT filename FROM lecture WHERE id=?', [lectureId]);
        const videoDir = path.join(__dirname, '..', 'uploads', filename)

		if (filename) {
			return res.status(200).json({path: videoDir});
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
		const [[ {filename} ]] = await db.query('SELECT filename FROM lecture WHERE id=?', [lectureId]);
        const videoDir = path.join(__dirname, '..', 'uploads', filename)

		if (filename) {
            unlink(videoDir, (err) => {
                if (err) return res.json(stat(500, err));
                else return res.json(stat(200, 'Succesfully deleted from File system.'));
            });
		} else {
			return res.json(stat(400, 'Lecture id doesn\'t exists.'));
		}
	} catch (err) {
		return res.json(stat(500, err.message));
	}
})


export default lectures;