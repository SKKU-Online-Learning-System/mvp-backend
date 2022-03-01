import express from 'express';

import authRouter from './../routes/auth';
import userRouter from './../routes/user';
import courseRouter from './../routes/course';
import lectureRouter from './../routes/lecture';


const router = express.Router();

// routing
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/courses', courseRouter);
router.use('/lectures', lectureRouter);


export default router;