export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

export type NotificationMetadata = {
  email: string;
  content: string;
  [key: string]: any;
};
