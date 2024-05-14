"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNotification = exports.notificationSchema = void 0;
const zod_1 = require("zod");
exports.notificationSchema = zod_1.z.object({
    event: zod_1.z.string(),
    deliveryVia: zod_1.z.enum(['EMAIL', 'SYSTEM']),
    type: zod_1.z.enum(['INSTANT', 'BATCH']),
    metadata: zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        content: zod_1.z.string(),
        userId: zod_1.z.string().uuid().optional(),
    })
    // .refine(data => {
    //   if (data.deliveryVia === 'EMAIL') {
    //     return !!data.email;
    //   }
    //   if (data.deliveryVia === 'SYSTEM') {
    //     return !!data.userId;
    //   }
    //   return true;
    // }, {
    //   message: 'Invalid metadata for the delivery method',
    //   path: ['metadata'],
    // }),
});
const validateNotification = (req, res, next) => {
    try {
        exports.notificationSchema.parse(req.body);
        next();
    }
    catch (error) {
        res.status(400).json({ error: error.errors });
    }
};
exports.validateNotification = validateNotification;
