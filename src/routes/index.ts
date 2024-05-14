// src/routes/index.ts
import express from 'express';
import { notificationRouter } from './notifications';
import { userRouter } from './users';

export const apiRouter = express.Router();

apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/users', userRouter);
