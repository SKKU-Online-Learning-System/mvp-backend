import express from 'express';

import authRouter from './../routes/auth';
import userRouter from './../routes/user';
import courseRouter from './../routes/course';
import lectureRouter from './../routes/lecture';
import historyRouter from './../routes/history';


const router = express.Router();

// routing
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/courses', courseRouter);
router.use('/lectures', lectureRouter);
router.use('/history', historyRouter);


export default router;