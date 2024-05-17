import request from "supertest";
import express from "express";
import { createSystemNotification } from "../controllers/notifications";
import emailQueue from "../queues/emailQueue";
import db from "../connections";
import jwt from "jsonwebtoken";
import { CustomHeaders } from "../types/config";

const app = express();

const authMiddleware: express.RequestHandler = (req, res, next) => {
  const token = jwt.sign({ userId: "user-1" }, "secretkey");
  (req.headers as CustomHeaders).authorization = `Bearer ${token}`;
  next();
};

app.use(express.json());
app.post("/notifications", createSystemNotification);

jest.mock("../queues/emailQueue");

describe("createSystemNotification", () => {
  beforeAll(async () => {
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  beforeEach(() => {
    app.use(authMiddleware);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await db.notification.deleteMany();
    await db.batchNotification.deleteMany();
  });

  test("should create an instant email notification", async () => {
    const response = await request(app)
      .post("/notifications")
      .send({
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        type: "INSTANT",
        metadata: {
          email: "test@test.com",
          content: "Test content",
          userId: "user-1",
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Email notification sent");
    expect(emailQueue.add).toHaveBeenCalledWith({
      to: "test@test.com",
      subject: "EVENT_OCCURRED",
      body: "Test content",
    });

    const notifications = await db.notification.findMany();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe("INSTANT");
  });

  test("should create and add to a batch notification", async () => {
    await db.batchNotification.create({
      data: {
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        processed: false,
        metadata: { email: "test@test.com", content: "Test batch content" },
      },
    });

    const response = await request(app)
      .post("/notifications")
      .send({
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        type: "BATCH",
        metadata: {
          email: "test@test.com",
          content: "Test content",
          userId: "user-1",
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Batch notification created/added");

    const batch = await db.batchNotification.findFirst({
      where: {
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        processed: false,
      },
      include: { notifications: true },
    });

    expect(batch).not.toBeNull();
    expect(batch?.notifications).toHaveLength(1);
    expect(batch?.notifications[0].type).toBe("BATCH");
  });

  test("should process batch when max size is reached", async () => {
    const MAX_BATCH_SIZE = 5;

    for (let i = 0; i < MAX_BATCH_SIZE - 1; i++) {
      await db.notification.create({
        data: {
          event: "EVENT_OCCURRED",
          deliveryVia: "EMAIL",
          type: "BATCH",
          metadata: {
            email: `test${i}@test.com`,
            content: `Test content ${i}`,
            userId: `user-${i}`,
          },
          batchNotificationId: "batch-id",
          userId: `user-${i}`,
        },
      });
    }

    await db.batchNotification.create({
      data: {
        id: "batch-id",
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        processed: false,
        metadata: { email: "test@test.com", content: "Test batch content" },
      },
    });

    const response = await request(app)
      .post("/notifications")
      .send({
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        type: "BATCH",
        metadata: {
          email: "test@test.com",
          content: "Test content",
          userId: "user-5",
        },
      });

    expect(response.status).toBe(201);

    const batch = await db.batchNotification.findUnique({
      where: { id: "batch-id" },
      include: { notifications: true },
    });

    expect(batch).not.toBeNull();
    expect(batch?.processed).toBe(true);
    expect(emailQueue.add).toHaveBeenCalled();
  });

  test("should process batch when max wait time is exceeded", async () => {
    const MAX_WAIT_TIME_MS = 2 * 60 * 60 * 1000;

    const batch = await db.batchNotification.create({
      data: {
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        processed: false,
        metadata: { email: "test@test.com", content: "Test batch content" },
        createdAt: new Date(Date.now() - MAX_WAIT_TIME_MS - 1000),
      },
    });

    await db.notification.create({
      data: {
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        type: "BATCH",
        metadata: {
          email: "test@test.com",
          content: "Test content",
          userId: "user-1",
        },
        batchNotificationId: batch.id,
        userId: "user-1",
      },
    });

    const response = await request(app)
      .post("/notifications")
      .send({
        event: "EVENT_OCCURRED",
        deliveryVia: "EMAIL",
        type: "BATCH",
        metadata: {
          email: "test@test.com",
          content: "Test content",
          userId: "user-2",
        },
      });

    expect(response.status).toBe(201);

    const updatedBatch = await db.batchNotification.findUnique({
      where: { id: batch.id },
      include: { notifications: true },
    });

    expect(updatedBatch).not.toBeNull();
    expect(updatedBatch?.processed).toBe(true);
    expect(emailQueue.add).toHaveBeenCalled();
  });
});
