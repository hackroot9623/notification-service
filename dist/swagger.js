"use strict";
// // src/swagger.ts
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerAutogen from "swagger-autogen";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Notification Service API",
//       version: "1.0.0",
//     },
//   },
//   apis: ["./src/routes/*.ts"],
// };
// export const swaggerSpec = swaggerJsdoc(options);
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        title: "Your API Title",
        description: "Your API Description",
    },
    host: "localhost:3000",
    schemes: ["http"],
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/*.ts"];
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
