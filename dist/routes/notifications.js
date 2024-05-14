"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
// src/routes/notifications.ts
const express_1 = __importDefault(require("express"));
const notifications_1 = require("../controllers/notifications");
const notificationValidator_1 = require("../validators/notificationValidator");
const auth_1 = require("../middleware/auth");
exports.notificationRouter = express_1.default.Router();
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
exports.notificationRouter.post('/', notificationValidator_1.validateNotification, notifications_1.createNotification);
exports.notificationRouter.get('/', notifications_1.listNotifications);
exports.notificationRouter.delete('/:id', notifications_1.deleteNotification);
exports.notificationRouter.patch('/:id/read', notifications_1.markAsRead);
exports.notificationRouter.use(auth_1.authenticateToken);
