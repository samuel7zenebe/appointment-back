import { z } from "zod";
import { Role } from "@prisma/client";

export const adminUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  role: z.enum([Role.PATIENT, Role.DOCTOR, Role.ADMIN]).optional(),
  isActive: z.coerce.boolean().optional(),
  q: z.string().min(1).optional(),
});

export const adminUserIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const suspendBodySchema = z.object({
  isActive: z.boolean(),
});

export const createSpecialtyBodySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});
