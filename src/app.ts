import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { apiRouter } from "./routes";
import { swaggerSpec } from "./config/swagger";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(apiRateLimiter);
  app.use(requestLogger);
  app.use(express.static("public"));

  /**
   * @openapi
   * /health:
   *   get:
   *     tags: [System]
   *     security: []
   *     summary: Health check
   *     responses:
   *       200:
   *         description: OK
   */
  app.get("/health", (_req, res) => res.json({ ok: true }));

  /**
   * @openapi
   * /openapi.json:
   *   get:
   *     tags: [System]
   *     security: []
   *     summary: OpenAPI JSON
   *     responses:
   *       200:
   *         description: OpenAPI specification
   */
  app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api", apiRouter);

  app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));
  app.use(errorHandler);

  return app;
}
