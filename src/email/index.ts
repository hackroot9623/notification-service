import sgMail from "@sendgrid/mail";
// import mailgun from 'mailgun-js';

const emailProvider = process.env.EMAIL_PROVIDER || "sendgrid";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// const mailgunClient = mailgun({
//   apiKey: process.env.MAILGUN_API_KEY!,
//   domain: process.env.MAILGUN_DOMAIN!,
// });

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

// async function sendEmailWithMailgun({ to, subject, body }: EmailData) {
//   const data = {
//     from: 'your-email@example.com',
//     to,
//     subject,
//     text: body,
//   };
//   await mailgunClient.messages().send(data);
// }

async function sendEmail({ to, subject, body }: EmailData) {
  switch (emailProvider) {
    case "sendgrid":
      await sendEmailWithSendGrid({ to, subject, body });
      break;
    // case 'mailgun':
    //   await sendEmailWithMailgun({ to, subject, body });
    //   break;
    default:
      throw new Error("Unsupported email provider");
  }
}

export default { sendEmail };
