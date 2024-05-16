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
 *     summary: Create a notification
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
 *       200:
 *         description: Notification created
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
