import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRoles } from "../../middleware/rbac";
import { validate } from "../../middleware/validate";
import * as DoctorsController from "./doctors.controller";
import {
  createAvailabilityBodySchema,
  doctorIdParamsSchema,
  doctorsListQuerySchema,
} from "./doctors.validation";
import { updateDoctorProfileBodySchema } from "./doctors.validation";
import { Role } from "../../generated/prisma";

export const doctorsRouter = Router();

/**
 * @openapi
 * /doctors:
 *   get:
 *     tags: [Doctors]
 *     security: []
 *     summary: List doctors (pagination + search)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 50 }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by doctor name or specialty
 *       - in: query
 *         name: specialtyId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorsListResponse'
 */
doctorsRouter.get(
  "/",
  validate({ query: doctorsListQuerySchema }),
  DoctorsController.listDoctors,
);

doctorsRouter.post(
  "/availability",
  requireAuth,
  requireRoles(Role.DOCTOR),
  validate({ body: createAvailabilityBodySchema }),
  DoctorsController.createAvailability,
);

/**
 * @openapi
 * /doctors/availability:
 *   post:
 *     tags: [Doctors]
 *     summary: Create availability slots (doctor only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAvailabilityRequest'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAvailabilityResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         description: Conflict (overlapping slots)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @openapi
 * /doctors/appointments:
 *   get:
 *     tags: [Doctors]
 *     summary: Get upcoming appointments (doctor only)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorAppointmentsResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
doctorsRouter.get(
  "/appointments",
  requireAuth,
  requireRoles(Role.DOCTOR),
  DoctorsController.getDoctorAppointments,
);

/**
 * @openapi
 * /doctors/profile:
 *   patch:
 *     tags: [Doctors]
 *     summary: Update my doctor profile (doctor only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDoctorProfileRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateDoctorProfileResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
doctorsRouter.patch(
  "/profile",
  requireAuth,
  requireRoles(Role.DOCTOR),
  validate({ body: updateDoctorProfileBodySchema }),
  DoctorsController.updateMyProfile,
);

/**
 * @openapi
 * /doctors/{id}/availability:
 *   get:
 *     tags: [Doctors]
 *     security: []
 *     summary: List available slots for a doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorAvailabilityResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
doctorsRouter.get(
  "/:id/availability",
  validate({ params: doctorIdParamsSchema }),
  DoctorsController.getDoctorAvailability,
);

/**
 * @openapi
 * /doctors/{id}:
 *   get:
 *     tags: [Doctors]
 *     security: []
 *     summary: Get doctor details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorDetailResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
doctorsRouter.get(
  "/:id",
  validate({ params: doctorIdParamsSchema }),
  DoctorsController.getDoctor,
);
