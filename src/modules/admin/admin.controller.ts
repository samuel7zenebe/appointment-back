import type { RequestHandler } from "express";
import * as AdminService from "./admin.service";

export const listUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await AdminService.listUsers(req.query as any);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const suspendUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await AdminService.suspendUser(req.params.id, req.body.isActive);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createSpecialty: RequestHandler = async (req, res, next) => {
  try {
    const result = await AdminService.createSpecialty(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const analytics: RequestHandler = async (_req, res, next) => {
  try {
    const result = await AdminService.analytics();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

