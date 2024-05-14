"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/__tests__/notification.test.ts
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server")); // Assume app is exported from server.ts
describe('Notification API', () => {
    it('should create a notification', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/notifications')
            .send({
            event: 'EVENT_OCCURRED',
            deliveryVia: 'EMAIL',
            type: 'INSTANT',
            metadata: { email: 'test@test.com', content: 'Hello' },
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
    });
    it('should list notifications', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/notifications');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
