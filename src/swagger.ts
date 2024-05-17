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
    description: "Documentación de la API para el Servicio de Notificaciones",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Notifications",
      description: "Endpoints relacionados con las notificaciones",
    },
  ],
};

export default swaggerOptions;
