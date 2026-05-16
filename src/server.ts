import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./prisma/client";

async function main() {
  const app = createApp();
  const server = app.listen(env.PORT, () => logger.info(`listening_on_${env.PORT}`));

  const shutdown = async () => {
    logger.info("shutdown_started");
    server.close();
    await prisma.$disconnect();
    logger.info("shutdown_complete");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  logger.error("startup_failed", { err: String(err) });
  process.exit(1);
});
