import { Request, Response } from "express";
import { notificationSchema } from "../validators/notificationValidator";
import db from "../conections";
import { EmailJobData } from "../types/email";
import emailQueue from "../queues/emailQueue";

// export const createSystemNotification = async (req: Request, res: Response) => {
//   try {
//     const notificationData = notificationSchema.parse(req.body);

//     if (notificationData.type === "BATCH") {
//       const existingBatch = await db.batchNotification.findFirst({
//         where: {
//           event: notificationData.event,
//           deliveryVia: notificationData.deliveryVia,
//           processed: false,
//         },
//       });

//       if (existingBatch) {
//         await db.notification.create({
//           data: {
//             event: notificationData.event,
//             deliveryVia: notificationData.deliveryVia,
//             type: notificationData.type,
//             metadata: notificationData.metadata,
//             batchNotificationId: existingBatch.id,
//             userId: notificationData.metadata.userId!,
//           },
//         });
//       } else {
//         const batch = await db.batchNotification.create({
//           data: {
//             event: notificationData.event,
//             deliveryVia: notificationData.deliveryVia,
//             metadata: notificationData.metadata,
//           },
//         });

//         await db.notification.create({
//           data: {
//             event: notificationData.event,
//             deliveryVia: notificationData.deliveryVia,
//             type: notificationData.type,
//             metadata: notificationData.metadata,
//             batchNotificationId: batch.id,
//             userId: notificationData.metadata.userId!,
//           },
//         });
//       }

//       res.status(201).json({ message: "Batch notification created/added" });
//     } else {
//       const notification = await db.notification.create({
//         data: {
//           event: notificationData.event,
//           deliveryVia: notificationData.deliveryVia,
//           type: notificationData.type,
//           metadata: notificationData.metadata,
//           userId: notificationData.metadata.userId!,
//         },
//       });
//       res.status(201).json(notification);
//     }
//   } catch (error: any) {
//     console.error("Validation Error:", error);
//     res.status(400).json({ error: error.errors || error.message });
//   }
// };

export const createSystemNotification = async (req: Request, res: Response) => {
  try {
    const notificationData = notificationSchema.parse(req.body);

    if (notificationData.type === "BATCH") {
      const existingBatch = await db.batchNotification.findFirst({
        where: {
          event: notificationData.event,
          deliveryVia: notificationData.deliveryVia,
          processed: false,
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
      } else {
        const batch = await db.batchNotification.create({
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
            batchNotificationId: batch.id,
            userId: notificationData.metadata.userId!,
          },
        });
      }

      res.status(201).json({ message: "Batch notification created/added" });
    } else {
      const notification = await db.notification.create({
        data: {
          event: notificationData.event,
          deliveryVia: notificationData.deliveryVia,
          type: notificationData.type,
          metadata: notificationData.metadata,
          userId: notificationData.metadata.userId!,
        },
      });

      // // Send the notification based on the deliveryVia field
      // if (notificationData.deliveryVia === "EMAIL") {
      //   const emailJobData: EmailJobData = {
      //     to: notificationData.metadata.email!,
      //     subject: notificationData.event,
      //     body: notificationData.metadata.content,
      //   };
      //   await emailQueue.add(emailJobData);
      //   // } else if (notificationData.deliveryVia === "SYSTEM") {
      //   //   // For system notifications, we could implement logic to notify the system user
      //   //   // For example, pushing a notification to a message queue or calling another microservice
      //   //   // This can be a placeholder for now or a simple log statement
      //   //   console.log(
      //   //     `System notification for user ${notificationData.metadata.userId!}: ${
      //   //       notificationData.metadata.content
      //   //     }`
      //   //   );
      // }

      res.status(201).json(notification);
    }
  } catch (error: any) {
    console.error("Validation Error:", error);
    res.status(400).json({ error: error.errors || error.message });
  }
};

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
