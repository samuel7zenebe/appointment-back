import { z } from "zod";
import { AppointmentStatus } from "@prisma/client";

export const createAppointmentBodySchema = z.object({
  slotId: z.string().min(1),
  notes: z.string().max(2000).optional(),
});

export const myAppointmentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.nativeEnum(AppointmentStatus).optional(),
});

export const appointmentIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const cancelAppointmentBodySchema = z.object({
  cancellationReason: z.string().min(3).max(500),
});

export const updateStatusBodySchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
});
