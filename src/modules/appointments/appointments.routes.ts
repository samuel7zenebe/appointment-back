import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRoles } from "../../middleware/rbac";
import { validate } from "../../middleware/validate";
import * as AppointmentsController from "./appointments.controller";
import {
  appointmentIdParamsSchema,
  cancelAppointmentBodySchema,
  createAppointmentBodySchema,
  myAppointmentsQuerySchema,
  updateStatusBodySchema,
} from "./appointments.validation";
import { Role } from "@prisma/client";

export const appointmentsRouter = Router();

/**
 * @openapi
 * /appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Book an appointment (patient only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentRequest'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAppointmentResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
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
 *         description: Conflict (double-booking or slot already booked)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
appointmentsRouter.post(
  "/",
  requireAuth,
  requireRoles(Role.PATIENT),
  validate({ body: createAppointmentBodySchema }),
  AppointmentsController.createAppointment,
);

/**
 * @openapi
 * /appointments/my:
 *   get:
 *     tags: [Appointments]
 *     summary: List my appointments (patient only)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 50 }
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/AppointmentStatus'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MyAppointmentsResponse'
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
appointmentsRouter.get(
  "/my",
  requireAuth,
  requireRoles(Role.PATIENT),
  validate({ query: myAppointmentsQuerySchema }),
  AppointmentsController.myAppointments,
);

/**
 * @openapi
 * /appointments/{id}/cancel:
 *   patch:
 *     tags: [Appointments]
 *     summary: Cancel my appointment (patient only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelAppointmentRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleAppointmentStatusResponse'
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         description: Conflict (completed cannot be cancelled)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
appointmentsRouter.patch(
  "/:id/cancel",
  requireAuth,
  requireRoles(Role.PATIENT),
  validate({
    params: appointmentIdParamsSchema,
    body: cancelAppointmentBodySchema,
  }),
  AppointmentsController.cancelAppointment,
);

/**
 * @openapi
 * /appointments/{id}/status:
 *   patch:
 *     tags: [Appointments]
 *     summary: Update appointment status (doctor or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAppointmentStatusRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleAppointmentStatusResponse'
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         description: Conflict (invalid status transition)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
appointmentsRouter.patch(
  "/:id/status",
  requireAuth,
  requireRoles(Role.DOCTOR, Role.ADMIN),
  validate({ params: appointmentIdParamsSchema, body: updateStatusBodySchema }),
  AppointmentsController.updateStatus,
);
