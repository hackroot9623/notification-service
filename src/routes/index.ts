import express from "express";
import { notificationRouter } from "./notifications";
import { userRouter } from "./users";
import authRouter from "./auth";

export const apiRouter = express.Router();

apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
