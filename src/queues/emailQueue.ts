import Queue from "bull";
import emailProvider from "../email";
import { EmailJobData } from "../types/email";

const emailQueue = new Queue<EmailJobData>("emailQueue", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

emailQueue.process(async (job) => {
  const { to, subject, body } = job.data;
  await emailProvider.sendEmail({ to, subject, body });
});

emailQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

export default emailQueue;
