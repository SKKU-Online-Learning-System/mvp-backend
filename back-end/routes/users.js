import express from 'express';
import mysql from 'mysql';
// import crypto from 'crypto';

import options from './../lib/db_users';

const router = express.Router();

// DB Connect
var users = mysql.createConnection(options);
users.connect();

// Lookup User Profile
router.get('/profile', (req, res, next) => {
  if (req.session.isLogined === undefined) {
    res.json({
      'statusCode': 401,
      'state': 'Unauthorized'
    });
  } else {
    users.query(
      `SELECT * FROM userinfo_test WHERE userNo=?`,
      [req.session.uid],
      (err, results, f) => {
        if (err) throw err;
        res.json(results[0]);
      }
    );
  }
});

// Update User Profile
router.post('/update', (req, res, next) => {
  users.query(
    `UPDATE userinfo SET userName=?, userSex=?, userPhone=?, userBirth=?, userDesc=? WHERE userNo=?`,
    [req.body.name, req.body.sex, req.body.phone, req.body.birth, req.body.desc, req.session.uid],
    (err, results, f) => {
      if (err) throw err;
      res.json({
        "statusCode": 200,
        "state": 'Success'
      });
    }
  );
});

export default router;