export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(params: { message: string; statusCode: number; code: string; details?: unknown }) {
    super(params.message);
    this.statusCode = params.statusCode;
    this.code = params.code;
    this.details = params.details;
  }
}

export const Errors = {
  badRequest: (message: string, details?: unknown) =>
    new AppError({ message, statusCode: 400, code: "BAD_REQUEST", details }),
  unauthorized: (message = "Unauthorized") =>
    new AppError({ message, statusCode: 401, code: "UNAUTHORIZED" }),
  forbidden: (message = "Forbidden") => new AppError({ message, statusCode: 403, code: "FORBIDDEN" }),
  notFound: (message = "Not found") => new AppError({ message, statusCode: 404, code: "NOT_FOUND" }),
  conflict: (message: string, details?: unknown) =>
    new AppError({ message, statusCode: 409, code: "CONFLICT", details }),
  tooManyRequests: (message = "Too many requests") =>
    new AppError({ message, statusCode: 429, code: "RATE_LIMIT" }),
  internal: (message = "Internal server error", details?: unknown) =>
    new AppError({ message, statusCode: 500, code: "INTERNAL_ERROR", details }),
};

