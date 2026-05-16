import winston from "winston";
import { env } from "./env";

const level = env.NODE_ENV === "production" ? "info" : "debug";

export const logger = winston.createLogger({
  level,
  defaultMeta: { service: "appointments-api" },
  transports: [
    new winston.transports.Console({
      format:
        env.NODE_ENV === "production"
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              winston.format.printf(({ level, message, timestamp, ...meta }) => {
                const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
                return `${timestamp} ${level}: ${message}${rest}`;
              }),
            ),
    }),
  ],
});

