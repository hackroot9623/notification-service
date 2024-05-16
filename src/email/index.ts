import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";

//Gmail
const createGmailTransporter = () => {
  return nodemailer.createTransport({
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

export const sendEmailWithGmail = async (
  to: string,
  subject: string,
  body: string
) => {
  const transporter = createGmailTransporter();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    body,
  };

  await transporter.sendMail(mailOptions);
};

// //Sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

async function sendEmailWithSendGrid({ to, subject, body }: EmailData) {
  const msg = {
    to,
    from: "your-email@example.com",
    subject,
    text: body,
  };
  await sgMail.send(msg);
}

async function sendEmail({ to, subject, body }: EmailData) {
  const emailProvider = process.env.EMAIL_PROVIDER;

  switch (emailProvider) {
    case "sendgrid":
      await sendEmailWithSendGrid({ to, subject, body });
      break;
    case "gmail":
      await sendEmailWithGmail(to, subject, body);
      break;
    default:
      throw new Error("Unsupported email provider");
  }
}

export default { sendEmail };
