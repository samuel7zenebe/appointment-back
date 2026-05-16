import type { RequestHandler } from "express";
import * as UsersService from "./users.service";
import { Errors } from "../../utils/errors";

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await UsersService.getMe(req.auth.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateMe: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await UsersService.updateMe(req.auth.userId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

