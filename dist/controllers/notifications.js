"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.deleteNotification = exports.listNotifications = exports.createSystemNotification = void 0;
const notificationValidator_1 = require("../validators/notificationValidator");
const conections_1 = __importDefault(require("../conections"));
const emailQueue_1 = __importDefault(require("../queues/emailQueue"));
const createSystemNotification = async (req, res) => {
    try {
        const notificationData = notificationValidator_1.notificationSchema.parse(req.body);
        if (notificationData.deliveryVia === "EMAIL" &&
            notificationData.type === "INSTANT") {
            const emailJob = {
                to: notificationData.metadata.email,
                subject: notificationData.event,
                body: notificationData.metadata.content,
            };
            await emailQueue_1.default.add(emailJob);
            res.status(201).json({ message: "Email notification sent" });
        }
        else {
            if (notificationData.type === "BATCH") {
                // Check if there's an existing batch for similar notifications
                const existingBatch = await conections_1.default.batchNotification.findFirst({
                    where: {
                        event: notificationData.event,
                        deliveryVia: notificationData.deliveryVia,
                        processed: false,
                    },
                });
                // If there's an existing batch, add the notification to it
                if (existingBatch) {
                    await conections_1.default.notification.create({
                        data: {
                            event: notificationData.event,
                            deliveryVia: notificationData.deliveryVia,
                            type: notificationData.type,
                            metadata: notificationData.metadata,
                            batchNotificationId: existingBatch.id,
                            userId: notificationData.metadata.userId,
                        },
                    });
                }
                else {
                    // If no existing batch, create a new batch
                    const batch = await conections_1.default.batchNotification.create({
                        data: {
                            event: notificationData.event,
                            deliveryVia: notificationData.deliveryVia,
                            metadata: notificationData.metadata,
                        },
                    });
                    // Add the notification to the newly created batch
                    await conections_1.default.notification.create({
                        data: {
                            event: notificationData.event,
                            deliveryVia: notificationData.deliveryVia,
                            type: notificationData.type,
                            metadata: notificationData.metadata,
                            batchNotificationId: batch.id,
                            userId: notificationData.metadata.userId,
                        },
                    });
                }
                res.status(201).json({ message: "Batch notification created/added" });
            }
            else {
                // For instant notifications or system notifications, create the notification directly
                const notification = await conections_1.default.notification.create({
                    data: {
                        event: notificationData.event,
                        deliveryVia: notificationData.deliveryVia,
                        type: notificationData.type,
                        metadata: notificationData.metadata,
                        userId: notificationData.metadata.userId,
                    },
                });
                res.status(201).json(notification);
            }
        }
    }
    catch (error) {
        console.error("Validation Error:", error);
        res.status(400).json({ error: error.errors || error.message });
    }
};
exports.createSystemNotification = createSystemNotification;
const listNotifications = async (req, res) => {
    try {
        const notifications = await conections_1.default.notification.findMany();
        res.json(notifications);
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res
            .status(500)
            .json({ error: "An error occurred while fetching notifications" });
    }
};
exports.listNotifications = listNotifications;
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        await conections_1.default.notification.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting notification:", error);
        res
            .status(500)
            .json({ error: "An error occurred while deleting the notification" });
    }
};
exports.deleteNotification = deleteNotification;
const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const foundNotification = await conections_1.default.notification.findUnique({
            where: { id },
        });
        if (foundNotification) {
            const readNotification = await conections_1.default.notification.update({
                where: { id: foundNotification.id },
                data: { read: true },
            });
            res.json(readNotification);
        }
        else {
            res.status(404).json({ error: "Notification not found" });
        }
    }
    catch (error) {
        console.error("Error marking notification as read:", error);
        res
            .status(500)
            .json({ error: "An error occurred while marking notification as read" });
    }
};
exports.markAsRead = markAsRead;
