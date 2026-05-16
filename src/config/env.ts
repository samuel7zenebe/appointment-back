import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_ACCESS_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  CORS_ORIGIN: z.string().default("*"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((i) => `${i.path.join(".") || "env"}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${message}`);
}

export const env = parsed.data;
export type Env = typeof env;
