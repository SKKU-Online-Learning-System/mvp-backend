import express from 'express';
import multer from 'multer';
import path from 'path'
import { isLoggedIn } from '../passport/middleware';

import { DB_promisePool as db, stat } from './../configs'


// express
const lectures = express.Router();

// multer config
const storage = multer.diskStorage({
    destination: 'uploads/',
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

lectures.get('/upload', (req, res, next) => {
    res.render('upload', { title: 'Upload' });
});

/**
 * lecture upload api (create)
 */
lectures.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const path = "../uploads/" + req.file.filename;
        const id = req.params.id;
        const isDuplicate = await db.query('SELECT id from lectures where filename=?', id);
        
        if (isDuplicate) {
            return res.json(stat(404, {success: false}));
        }

        const dml = 'INSERT INTO lecture(title, filename, attached, course_id, created_at) VALUES(?, ?, ?, ?, ?, NOW())';
        const params = [];
        await db.query(sql, params);


        res.json({success: true});
    } catch(err) {
        res.json(stat(400, err.message));
    }
});

lectures.post('/', isLoggedIn, async (req, res) => {

})










export default lectures;