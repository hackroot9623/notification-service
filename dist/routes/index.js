"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const notifications_1 = require("./notifications");
const users_1 = require("./users");
const auth_1 = __importDefault(require("./auth"));
exports.apiRouter = express_1.default.Router();
exports.apiRouter.use("/notifications", notifications_1.notificationRouter);
exports.apiRouter.use("/users", users_1.userRouter);
exports.apiRouter.use("/auth", auth_1.default);
