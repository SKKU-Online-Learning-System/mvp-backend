import express from 'express';
import { unlink } from 'fs';
import multer from 'multer';
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'
import path from 'path'

import { DB_promisePool as db, stat } from './../configs'

aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: process.env.REGION
});

// express
const lectures = express.Router();
const s3 = new aws.S3();


/* JSON
  fieldname: 'video',
  originalname: '2022-04 데브 매칭.mp4',
  encoding: '7bit',
  mimetype: 'video/mp4',
  size: 149933838,
  bucket: 'mrdang.com',
  key: 'lectures/1650796752974_video.mp4',
  acl: 'public-read-write',
  contentType: 'application/octet-stream',
  contentDisposition: null,
  contentEncoding: null,
  storageClass: 'STANDARD',
  serverSideEncryption: null,
  metadata: null,
  location: 'https://s3.ap-northeast-2.amazonaws.com/mrdang.com/lectures/1650796752974_video.mp4',
  etag: '"189e1052a9349d2c17faef8fda042a4d-29"',
  versionId: undefined
*/

// multer config
const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    acl: 'public-read-write',
    key: (req, file, cb) => {
        const suffix = Date.now() + '_';
        cb(null, 'lectures/'+ suffix + file.fieldname + path.extname(file.originalname));
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
lectures.post('/upload/:courseId', upload.array('video'), async (req, res) => {
    try {
        const params = [];
        req.files.forEach((video) => {
            params.push([video.originalname, video.key, req.params.courseId]);
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
        const url = process.env.S3_URL+process.env.BUCKET
        const videoPath = path.join(url, filename)

		if (filename) {
            console.log(videoPath)
			return res.status(200).json({path: videoPath});
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