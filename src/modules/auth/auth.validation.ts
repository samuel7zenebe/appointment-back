import { z } from "zod";
import { Role } from "@prisma/client";

export const registerBodySchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    phoneNumber: z.string().min(6).optional(),
    role: z.enum([Role.PATIENT, Role.DOCTOR]).optional(),
    specialtyId: z.string().min(1).optional(),
  })
  .refine((v) => (v.role === Role.DOCTOR ? Boolean(v.specialtyId) : true), {
    message: "specialtyId is required for doctors",
    path: ["specialtyId"],
  });

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
