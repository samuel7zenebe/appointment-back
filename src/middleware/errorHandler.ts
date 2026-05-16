import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { AppError, Errors } from "../utils/errors";
import { Prisma } from "../generated/prisma";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: err.issues,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: env.NODE_ENV === "production" ? undefined : err.details,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({
          success: false,
          message: "Unique constraint violation",
          error: err.meta,
        });
    }
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
  }

  logger.error("unhandled_error", { err: String(err) });
  const e = Errors.internal();
  return res.status(e.statusCode).json({
    success: false,
    message: e.message,
    error: env.NODE_ENV === "production" ? undefined : String(err),
  });
};
