import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "logs/notifications.log" }),
  ],
});

export default logger;
