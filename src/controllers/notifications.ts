import { Request, Response } from "express";
import { notificationSchema } from "../validators/notificationValidator";
import db from "../conections";
import { EmailJobData, NotificationMetadata } from "../types/email";
import emailQueue from "../queues/emailQueue";
import logger from "../utils/logger";
import { MAX_BATCH_SIZE, MAX_WAIT_TIME_MS } from "../types/config";

export const createSystemNotification = async (req: Request, res: Response) => {
  try {
    const notificationData = notificationSchema.parse(req.body);

    if (notificationData.type === "INSTANT") {
      const emailJob: EmailJobData = {
        to: notificationData.metadata.email!,
        subject: notificationData.event,
        body: notificationData.metadata.content,
      };
      await emailQueue.add(emailJob);
      logger.info("Notification created", { notification: notificationData });
      return res.status(201).json({ message: "Email notification sent" });
    }

    if (notificationData.type === "BATCH") {
      // Check for existing unprocessed batch with same event, deliveryVia, and userId
      const existingBatch = await db.batchNotification.findFirst({
        where: {
          event: notificationData.event,
          deliveryVia: notificationData.deliveryVia,
          processed: false,
          notifications: {
            some: { userId: notificationData.metadata.userId! },
          },
        },
      });

      if (existingBatch) {
        await db.notification.create({
          data: {
            event: notificationData.event,
            deliveryVia: notificationData.deliveryVia,
            type: notificationData.type,
            metadata: notificationData.metadata,
            batchNotificationId: existingBatch.id,
            userId: notificationData.metadata.userId!,
          },
        });

        // Check if the batch is ready to be processed
        const notificationsCount = await db.notification.count({
          where: { batchNotificationId: existingBatch.id },
        });

        const batchAge =
          new Date().getTime() - existingBatch.createdAt.getTime();

        if (
          notificationsCount >= MAX_BATCH_SIZE ||
          batchAge >= MAX_WAIT_TIME_MS
        ) {
          await processBatch(existingBatch.id);
        }
      } else {
        const newBatch = await db.batchNotification.create({
          data: {
            event: notificationData.event,
            deliveryVia: notificationData.deliveryVia,
            metadata: notificationData.metadata,
          },
        });

        await db.notification.create({
          data: {
            event: notificationData.event,
            deliveryVia: notificationData.deliveryVia,
            type: notificationData.type,
            metadata: notificationData.metadata,
            batchNotificationId: newBatch.id,
            userId: notificationData.metadata.userId!,
          },
        });
      }

      logger.info("Batch notification created/added", {
        notification: notificationData,
      });
      return res
        .status(201)
        .json({ message: "Batch notification created/added" });
    }

    // For system notifications
    const notification = await db.notification.create({
      data: {
        event: notificationData.event,
        deliveryVia: notificationData.deliveryVia,
        type: notificationData.type,
        metadata: notificationData.metadata,
        userId: notificationData.metadata.userId!,
      },
    });

    res.status(201).json(notification);
    logger.info("Notification created", { notification: notificationData });
  } catch (error: any) {
    console.error("Validation Error:", error);
    logger.error("Notification not created", { error: error });
    res.status(400).json({ error: error.errors || error.message });
  }
};

const processBatch = async (batchId: string) => {
  const batch = await db.batchNotification.findUnique({
    where: { id: batchId },
    include: { notifications: true },
  });

  if (!batch || batch.processed || !batch.notifications.length) return;

  const combinedContent = batch.notifications
    .map((n) => {
      const metadata = n.metadata as NotificationMetadata;
      return metadata.content;
    })
    .join("\n");

  // Process the combined notification
  const firstNotificationMetadata = batch.notifications[0]
    .metadata as NotificationMetadata;

  const emailJob: EmailJobData = {
    to: firstNotificationMetadata.email,
    subject: batch.event,
    body: combinedContent,
  };

  await emailQueue.add(emailJob);

  await db.batchNotification.update({
    where: { id: batchId },
    data: { processed: true },
  });

  logger.info("Batch processed and notification sent", { batchId });
};

//This is another alternative without the MAX_BATCH_SIZE and MAX_WAIT_TIME_MS
// export const createSystemNotification = async (req: Request, res: Response) => {
//   try {
//     const notificationData = notificationSchema.parse(req.body);

//     if (
//       notificationData.deliveryVia === "EMAIL" &&
//       notificationData.type === "INSTANT"
//     ) {
//       const emailJob: EmailJobData = {
//         to: notificationData.metadata.email!,
//         subject: notificationData.event,
//         body: notificationData.metadata.content,
//       };
//       await emailQueue.add(emailJob);
//       logger.info("Notification created", { notification: notificationData });
//       res.status(201).json({ message: "Email notification sent" });
//     } else {
//       if (notificationData.type === "BATCH") {
//         // Check if there's an existing batch for similar notifications
//         const existingBatch = await db.batchNotification.findFirst({
//           where: {
//             event: notificationData.event,
//             deliveryVia: notificationData.deliveryVia,
//             processed: false,
//           },
//         });

//         // If there's an existing batch, add the notification to it
//         if (existingBatch) {
//           await db.notification.create({
//             data: {
//               event: notificationData.event,
//               deliveryVia: notificationData.deliveryVia,
//               type: notificationData.type,
//               metadata: notificationData.metadata,
//               batchNotificationId: existingBatch.id,
//               userId: notificationData.metadata.userId!,
//             },
//           });
//         } else {
//           // If no existing batch, create a new batch
//           const batch = await db.batchNotification.create({
//             data: {
//               event: notificationData.event,
//               deliveryVia: notificationData.deliveryVia,
//               metadata: notificationData.metadata,
//             },
//           });

//           // Add the notification to the newly created batch
//           await db.notification.create({
//             data: {
//               event: notificationData.event,
//               deliveryVia: notificationData.deliveryVia,
//               type: notificationData.type,
//               metadata: notificationData.metadata,
//               batchNotificationId: batch.id,
//               userId: notificationData.metadata.userId!,
//             },
//           });
//         }
//         res.status(201).json({ message: "Batch notification created/added" });
//         console.log(notificationData);
//         logger.info("Notification created", { notification: notificationData });
//       } else {
//         // For instant notifications or system notifications, create the notification directly
//         const notification = await db.notification.create({
//           data: {
//             event: notificationData.event,
//             deliveryVia: notificationData.deliveryVia,
//             type: notificationData.type,
//             metadata: notificationData.metadata,
//             userId: notificationData.metadata.userId!,
//           },
//         });
//         res.status(201).json(notification);
//         logger.info("Notification created", { notification: notificationData });
//       }
//     }
//   } catch (error: any) {
//     console.error("Validation Error:", error);
//     res.status(400).json({ error: error.errors || error.message });
//   }
// };

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await db.notification.findMany();
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching notifications" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.notification.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting notification:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the notification" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const foundNotification = await db.notification.findUnique({
      where: { id },
    });

    if (foundNotification) {
      const readNotification = await db.notification.update({
        where: { id: foundNotification.id },
        data: { read: true },
      });
      res.json(readNotification);
    } else {
      res.status(404).json({ error: "Notification not found" });
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res
      .status(500)
      .json({ error: "An error occurred while marking notification as read" });
  }
};
