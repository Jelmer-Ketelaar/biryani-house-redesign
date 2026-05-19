import pino, { type LoggerOptions } from "pino";

const level = process.env.LOG_LEVEL ?? "info";

const options: LoggerOptions = {
  level,
  redact: {
    paths: ["password", "token", "authorization", "headers.authorization", "stripeSignature"],
    remove: true
  }
};

if (process.env.NODE_ENV === "development") {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: true
    }
  };
}

export const logger = pino(options);
