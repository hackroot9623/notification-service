"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const email_1 = __importDefault(require("../email"));
const emailQueue = new bull_1.default("emailQueue", "redis://127.0.0.1:6379");
emailQueue.process(async (job) => {
    const { to, subject, body } = job.data;
    await email_1.default.sendEmail({ to, subject, body });
});
emailQueue.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});
emailQueue.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed: ${err.message}`);
});
exports.default = emailQueue;
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
