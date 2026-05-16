import type { RequestHandler } from "express";
import * as AuthService from "./auth.service";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
