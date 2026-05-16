import { Role } from "@prisma/client";
import { ok } from "../../utils/apiResponse";
import { Errors } from "../../utils/errors";
import { AdminRepo } from "./admin.repo";

export async function listUsers(params: { page: number; limit: number; role?: Role; isActive?: boolean; q?: string }) {
  const skip = (params.page - 1) * params.limit;
  const [items, total] = await Promise.all([
    AdminRepo.listUsers({ skip, take: params.limit, role: params.role, isActive: params.isActive, q: params.q }),
    AdminRepo.countUsers({ role: params.role, isActive: params.isActive, q: params.q }),
  ]);
  return ok("Users", { items, page: params.page, limit: params.limit, total });
}

export async function suspendUser(userId: string, isActive: boolean) {
  const updated = await AdminRepo.setUserActive(userId, isActive);
  return ok("User updated", updated);
}

export async function createSpecialty(data: { name: string; description?: string }) {
  const created = await AdminRepo.createSpecialty(data);
  return ok("Specialty created", created);
}

export async function analytics() {
  return ok("Analytics", await AdminRepo.analytics());
}

