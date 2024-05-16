import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notification Service API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

// import swaggerAutogen from "swagger-autogen";

// const doc = {
//   info: {
//     title: "Your API Title",
//     description: "Your API Description",
//   },
//   host: "localhost:3000",
//   schemes: ["http"],
// };

// const outputFile = "./swagger-output.json";
// const endpointsFiles = ["./dist/routes/*.js"];

// swaggerAutogen()(outputFile, endpointsFiles, doc);
