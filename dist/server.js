"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// import { swaggerSpec } from "./swagger";
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
const swaggerDocument = require("./swagger-output.json");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use("/", routes_1.apiRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// process.on('SIGTERM', async () => {
//   await db.$disconnect();
//   process.exit(0);
// });
// process.on('SIGINT', async () => {
//   await db.$disconnect();
//   process.exit(0);
// });
exports.default = app;
