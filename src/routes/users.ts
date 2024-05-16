import express from "express";
import { listUsers } from "../controllers/users";
import authRouter from "./auth";

export const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 */
// userRouter.post('/', createUser);

userRouter.get("/", authRouter, listUsers);
