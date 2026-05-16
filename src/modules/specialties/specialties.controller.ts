import type { RequestHandler } from "express";
import * as SpecialtiesService from "./specialties.service";

export const listSpecialties: RequestHandler = async (_req, res, next) => {
  try {
    const result = await SpecialtiesService.listSpecialties();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

