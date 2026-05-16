import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { updateMeBodySchema } from "./users.validation";
import * as UsersController from "./users.controller";

export const usersRouter = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get my profile
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.get("/me", requireAuth, UsersController.getMe);

/**
 * @openapi
 * /users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update my profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeRequest'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.patch("/me", requireAuth, validate({ body: updateMeBodySchema }), UsersController.updateMe);
