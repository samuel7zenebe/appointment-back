import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { ZodError } from "zod";

export function validate(schema: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schema.body) (req as any).body = schema.body.parse(req.body);
      if (schema.query) (req as any).query = schema.query.parse(req.query);
      if (schema.params) (req as any).params = schema.params.parse(req.params);
      next();
    } catch (err) {
      next(err instanceof ZodError ? err : err);
    }
  };
}
