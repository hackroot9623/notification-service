import express from "express";
import { listUsers } from "../controllers/users";
import authRouter from "./auth";

export const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene una lista de todos los usuarios registrados.
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
userRouter.get("/", authRouter, listUsers);
