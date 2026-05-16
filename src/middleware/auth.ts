import type { RequestHandler } from "express";
import { prisma } from "../prisma/client";
import { Errors } from "../utils/errors";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.header("authorization") || "";
    const [, token] = header.split(" ");
    if (!token) throw Errors.unauthorized("Missing bearer token");

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null },
      select: { id: true, role: true, isActive: true },
    });
    if (!user) throw Errors.unauthorized("Invalid token user");
    if (!user.isActive) throw Errors.unauthorized("Account is suspended");

    req.auth = { userId: user.id, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};
