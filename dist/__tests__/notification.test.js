"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationsController = __importStar(require("../controllers/notifications"));
const conections_1 = __importDefault(require("../conections"));
describe("Notifications Controller", () => {
    let mockRequest;
    let mockResponse;
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
            };
            await notificationsController.createSystemNotification(req, mockResponse);
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
            };
            await notificationsController.createSystemNotification(req, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ event: "EVENT_OCCURRED" }));
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
            conections_1.default.notification.findMany.mockResolvedValue(mockNotifications);
            await notificationsController.listNotifications(mockRequest, mockResponse);
            expect(mockResponse.json).toHaveBeenCalledWith(mockNotifications);
        });
    });
    describe("deleteNotification", () => {
        it("should delete a notification", async () => {
            await notificationsController.deleteNotification(mockRequest, mockResponse);
            expect(conections_1.default.notification.delete).toHaveBeenCalledWith({
                where: { id: "1" },
            });
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });
    });
    describe("markAsRead", () => {
        it("should mark a notification as read", async () => {
            const mockNotification = { id: "1", read: false };
            conections_1.default.notification.findUnique.mockResolvedValue(mockNotification);
            await notificationsController.markAsRead(mockRequest, mockResponse);
            expect(conections_1.default.notification.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: { read: true },
            });
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ id: "1", read: true }));
        });
        it("should handle notification not found", async () => {
            conections_1.default.notification.findUnique.mockResolvedValue(null);
            await notificationsController.markAsRead(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "Notification not found",
            });
        });
    });
});
