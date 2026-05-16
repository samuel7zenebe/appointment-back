import { Router } from "express";
import * as SpecialtiesController from "./specialties.controller";

export const specialtiesRouter = Router();

/**
 * @openapi
 * /specialties:
 *   get:
 *     tags: [Specialties]
 *     security: []
 *     summary: List specialties
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpecialtiesResponse'
 */
specialtiesRouter.get("/", SpecialtiesController.listSpecialties);

