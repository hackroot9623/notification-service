"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.deleteNotification = exports.listNotifications = exports.createNotification = void 0;
const notificationValidator_1 = require("../validators/notificationValidator");
const conections_1 = __importDefault(require("../conections"));
const createNotification = async (req, res) => {
    try {
        const notificationData = notificationValidator_1.notificationSchema.parse(req.body);
        //   const userId = req.user.id
        if (notificationData.type === 'BATCH') {
            // Handle batch notification
            const existingBatch = await conections_1.default.batchNotification.findFirst({
                where: {
                    event: notificationData.event,
                    deliveryVia: notificationData.deliveryVia,
                    processed: false,
                },
            });
            if (existingBatch) {
                await conections_1.default.notification.create({
                    data: {
                        ...notificationData,
                        batchNotificationId: existingBatch.id,
                        userId: req.user.id || 'defaultUserId'
                    }
                });
            }
            else {
                const batch = await conections_1.default.batchNotification.create({
                    data: {
                        event: notificationData.event,
                        deliveryVia: notificationData.deliveryVia,
                        metadata: notificationData.metadata,
                    },
                });
                await conections_1.default.notification.create({
                    data: { ...notificationData, batchNotificationId: batch.id, userId: req.user.id },
                });
            }
            res.status(201).json({ message: 'Batch notification created/added' });
        }
        else {
            // Handle instant notification
            const notification = await conections_1.default.notification.create({
                data: {
                    ...notificationData,
                    userId: req.user.id,
                },
            });
            res.status(201).json(notification);
        }
    }
    catch (error) {
        res.status(400).json({ error: error.errors });
    }
};
exports.createNotification = createNotification;
const listNotifications = async (req, res) => {
    const notifications = await conections_1.default.notification.findMany();
    res.json(notifications);
};
exports.listNotifications = listNotifications;
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    await conections_1.default.notification.delete({ where: { id } });
    res.status(204).send();
};
exports.deleteNotification = deleteNotification;
const markAsRead = async (req, res) => {
    const { id } = req.params;
    const notification = await conections_1.default.notification.update({
        where: { id },
        data: { read: true },
    });
    res.json(notification);
};
exports.markAsRead = markAsRead;
