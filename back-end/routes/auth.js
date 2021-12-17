import express from 'express';
import mysql from 'mysql';
import crypto from 'crypto';

import options from './../lib/db_users';

const router = express.Router();

// DB Connect
var users = mysql.createConnection(options);
users.connect();

// Password Hashing Option
const iterations = 1000000;
const keylen = 128;
const digest = 'sha512';
const encoding = 'base64';



// Join
router.post('/join', function(req, res, next) {
  const salt = crypto.randomBytes(keylen).toString(encoding);
  const key = crypto.pbkdf2Sync(req.body.pw, salt, iterations, keylen, digest).toString(encoding);
  users.query(
    `INSERT INTO userinfo(userID, userPW, userName, userSex, userPhone, userBirth, userJoin, userDesc, userSalt) VALUES(?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
    [req.body.id, key, req.body.name, req.body.sex, req.body.phone, req.body.birth, req.body.desc, salt],
    (err, results, f) => {
      if (err) throw err;
      res.json({
        "statusCode": 200,
        "state": 'Success'
      });
    }
  );
});

// Log in
router.post('/login', (req, res, next) => {
  users.query(
    `SELECT * FROM userinfo WHERE userID=?`,
    [req.body.id],
    (err, results, f) => {
      if (err) throw err;
      
      if (results[0] == undefined) {
        res.json({
          'statusCode': 401,
          'state': 'invalid ID'
        });
      }
      else {
        const { userNo, userID, userPW, userSalt } = results[0];
        const key = crypto.pbkdf2Sync(req.body.pw, userSalt, iterations, keylen, digest).toString(encoding);
        if (userPW == key) {
          req.session.uid = userNo;
          req.session.isLogined = true;
          req.session.userName = userID;
          res.json({
              'statusCode': 200,
              'state': 'Success'
          });
        }
        else {
          res.json({
            'statusCode': 401,
            'state': 'wrong password'
          });
        }
      }
    }
  );
});

// Log out
router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err){});
  res.json({
    'statusCode': 200,
    'state': 'Success'
  });
});


export default router;
