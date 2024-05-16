import Queue from "bull";
import emailProvider from "../email";
import { EmailJobData } from "../types/email";

const emailQueue = new Queue("emailQueue", "redis://127.0.0.1:6379");

emailQueue.process(async (job: Queue.Job<EmailJobData>) => {
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

// // Process jobs in the email queue
// emailQueue.process((job: Queue.Job<TransactionData>) => {
//   const { type, params } = job.data;

//   try {
//     switch (type) {
//       case "TRANSACTION_NOTIFICATION":
//         // Send transaction notification email
//         transactionNotification({
//           to: params.to,
//           name_to: params.name_to,
//           transactionData: params.transactionData,
//         });
//         break;
//       default:
//         console.log("Unsupported email type:", type);
//     }
//   } catch (error) {
//     console.log("Error processing email job:", error);
//   }
// });
