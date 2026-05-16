import { z } from "zod";

export const updateMeBodySchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().min(6).optional(),
  profileImage: z.string().url().optional(),
});

