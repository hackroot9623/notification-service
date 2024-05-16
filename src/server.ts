import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { apiRouter } from "./routes";
import bodyParser from "body-parser";

const swaggerDocument = require("./swagger-output.json");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", apiRouter);

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

export default app;
