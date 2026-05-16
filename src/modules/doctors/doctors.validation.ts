import { z } from "zod";

export const doctorsListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  q: z.string().min(1).optional(),
  specialtyId: z.string().min(1).optional(),
});

export const doctorIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const createAvailabilityBodySchema = z.object({
  slots: z
    .array(
      z.object({
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
      }),
    )
    .min(1),
});

export const updateDoctorProfileBodySchema = z.object({
  specialtyId: z.string().min(1).optional(),
  bio: z.string().max(2000).optional(),
  experienceYears: z.coerce.number().int().min(0).max(80).optional(),
  consultationFee: z.coerce.number().int().min(0).optional(),
  clinicAddress: z.string().max(300).optional(),
});
