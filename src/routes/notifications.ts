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

notificationRouter.post(
  "/",
  validateNotification,
  authenticateJWT,
  createSystemNotification
);

notificationRouter.get("/", authenticateJWT, listNotifications);
notificationRouter.delete("/:id", authenticateJWT, deleteNotification);
notificationRouter.patch("/:id/read", authenticateJWT, markAsRead);
