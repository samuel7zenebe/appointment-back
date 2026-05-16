import type { RequestHandler } from "express";
import { Errors } from "../utils/errors";
import { Role } from "@prisma/client";

export function requireRoles(...roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) return next(Errors.unauthorized());
    if (!roles.includes(req.auth.role))
      return next(Errors.forbidden("Insufficient role"));
    next();
  };
}
