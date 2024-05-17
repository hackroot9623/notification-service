import Queue from "bull";
import emailProvider from "../email";
import { EmailJobData } from "../types/email";
import logger from "../utils/logger";

const emailQueue = new Queue("emailQueue", "redis://127.0.0.1:6379");

emailQueue.process(async (job: Queue.Job<EmailJobData>) => {
  const { to, subject, body } = job.data;
  await emailProvider.sendEmail({ to, subject, body });
});

emailQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completado`);
  logger.info("Task completed", { message: "completed" });
});

emailQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
  logger.error("Task failed", { err: err });
});

export default emailQueue;
