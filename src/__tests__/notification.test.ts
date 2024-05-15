import { Request, Response } from "express";
import * as notificationsController from "../controllers/notifications";
import db from "../conections";

describe("Notifications Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("createSystemNotification", () => {
    it("should create a batch notification", async () => {
      const req = {
        body: {
          event: "EVENT_OCCURRED",
          deliveryVia: "EMAIL",
          type: "BATCH",
          metadata: { email: "test@test.com", content: "Hello", userId: 123 },
        },
      } as Request;
      await notificationsController.createSystemNotification(
        req,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Batch notification created/added",
      });
    });

    it("should create a regular notification", async () => {
      const req = {
        body: {
          event: "EVENT_OCCURRED",
          deliveryVia: "EMAIL",
          type: "INSTANT",
          metadata: { email: "test@test.com", content: "Hello", userId: 123 },
        },
      } as Request;
      await notificationsController.createSystemNotification(
        req,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ event: "EVENT_OCCURRED" })
      );
    });
  });

  describe("listNotifications", () => {
    it("should list notifications", async () => {
      const mockNotifications = [
        {
          id: 1,
          event: "EVENT_OCCURRED",
          deliveryVia: "EMAIL",
          type: "INSTANT",
          metadata: { email: "test@test.com", content: "Hello", userId: 123 },
        },
      ];
      (db.notification.findMany as jest.Mock).mockResolvedValue(
        mockNotifications
      );
      await notificationsController.listNotifications(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockNotifications);
    });
  });

  describe("deleteNotification", () => {
    it("should delete a notification", async () => {
      await notificationsController.deleteNotification(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(db.notification.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe("markAsRead", () => {
    it("should mark a notification as read", async () => {
      const mockNotification = { id: "1", read: false };
      (db.notification.findUnique as jest.Mock).mockResolvedValue(
        mockNotification
      );
      await notificationsController.markAsRead(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(db.notification.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { read: true },
      });
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: "1", read: true })
      );
    });

    it("should handle notification not found", async () => {
      (db.notification.findUnique as jest.Mock).mockResolvedValue(null);
      await notificationsController.markAsRead(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Notification not found",
      });
    });
  });
});
