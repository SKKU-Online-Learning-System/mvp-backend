import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let isLogined, userName;
  if (req.session === undefined) {
    isLogined = false;
  } else {
    isLogined = req.session.isLogined;
    userName = req.session.userName;
  }
  res.render('index', { title: 'Express', isLogined: isLogined, userName: userName });
});

router.get('/login', function(req, res, next) {
  let isLogined, userName;
  if (req.session === undefined) {
    isLogined = false;
  } else {
    isLogined = req.session.isLogined;
    userName = req.session.userName;
  }
  res.render('login', { title: 'Log in', isLogined: isLogined, userName: userName });
});

router.get('/join', function(req, res, next) {
  let isLogined, userName;
  if (req.session === undefined) {
    isLogined = false;
  } else {
    isLogined = req.session.isLogined;
    userName = req.session.userName;
  }
  res.render('join', { title: 'Join', isLogined: isLogined, userName: userName });
});

export default router;
