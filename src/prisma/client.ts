import { PrismaClient } from "../generated/prisma";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { PrismaNeon } from "@prisma/adapter-neon";

import "dotenv/config";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
  log:
    env.NODE_ENV === "development"
      ? [
          { level: "warn", emit: "event" },
          { level: "error", emit: "event" },
        ]
      : [{ level: "error", emit: "event" }],
});

prisma.$on("warn", (e: any) => logger.warn(e.message));
prisma.$on("error", (e: any) => logger.error(e.message));
