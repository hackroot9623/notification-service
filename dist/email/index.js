"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailWithGmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const nodemailer_1 = __importDefault(require("nodemailer"));
//Gmail
const createGmailTransporter = () => {
    return nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
        tls: {
            ciphers: "SSLv3",
        },
        requireTLS: true,
    });
};
const sendEmailWithGmail = async (to, subject, body) => {
    const transporter = createGmailTransporter();
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        body,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendEmailWithGmail = sendEmailWithGmail;
// //Sendgrid
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
async function sendEmailWithSendGrid({ to, subject, body }) {
    const msg = {
        to,
        from: "your-email@example.com",
        subject,
        text: body,
    };
    await mail_1.default.send(msg);
}
async function sendEmail({ to, subject, body }) {
    const emailProvider = process.env.EMAIL_PROVIDER;
    switch (emailProvider) {
        case "sendgrid":
            await sendEmailWithSendGrid({ to, subject, body });
            break;
        case "gmail":
            await (0, exports.sendEmailWithGmail)(to, subject, body);
            break;
        default:
            throw new Error("Unsupported email provider");
    }
}
exports.default = { sendEmail };
