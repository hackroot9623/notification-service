// import swaggerJsdoc from "swagger-jsdoc";

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

// swaggerConfig.ts
import SwaggerOptions from "swagger-autogen";

const swaggerOptions: {
  info: { title: string; version: string; description: string };
  host: string;
  basePath: string;
  schemes: string[];
  consumes: string[];
  produces: string[];
  tags: { name: string; description: string }[];
} = {
  info: {
    title: "Notification Service API",
    version: "1.0.0",
    description: "API documentation for the Notification Service",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Notifications",
      description: "Endpoints related to notifications",
    },
  ],
};

export default swaggerOptions;
