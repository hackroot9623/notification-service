// generateSwagger.ts
import swaggerAutogen from "swagger-autogen";
import swaggerOptions from "./swagger";

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./src/routes/notifications.ts",
  "./src/routes/users.ts",
];

swaggerAutogen()(outputFile, endpointsFiles, swaggerOptions);
