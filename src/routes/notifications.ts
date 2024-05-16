import express from "express";
import {
  listNotifications,
  deleteNotification,
  markAsRead,
  createSystemNotification,
} from "../controllers/notifications";
import { validateNotification } from "../validators/notificationValidator";
import { authenticateJWT } from "../middleware/auth";

export const notificationRouter = express.Router();

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Crea una notificación
 *     description: Crea una notificación según el tipo de entrega y tipo de notificación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               deliveryVia:
 *                 type: string
 *               type:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *   get:
 *     summary: Obtiene todas las notificaciones
 *     description: Obtiene una lista de todas las notificaciones existentes.
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *   delete:
 *     summary: Elimina una notificación por ID
 *     description: Elimina una notificación específica según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Notificación eliminada exitosamente
 *   patch:
 *     summary: Marca una notificación como leída
 *     description: Marca una notificación como leída según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 */
notificationRouter.post(
  "/",
  validateNotification,
  authenticateJWT,
  createSystemNotification
);

notificationRouter.get("/", authenticateJWT, listNotifications);
notificationRouter.delete("/:id", authenticateJWT, deleteNotification);
notificationRouter.patch("/:id/read", authenticateJWT, markAsRead);
