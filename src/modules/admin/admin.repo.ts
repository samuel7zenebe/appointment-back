import { Role } from "@prisma/client";
import { prisma } from "../../prisma/client";

export const AdminRepo = {
  listUsers: (params: {
    skip: number;
    take: number;
    role?: Role;
    isActive?: boolean;
    q?: string;
  }) =>
    prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(params.role ? { role: params.role } : {}),
        ...(typeof params.isActive === "boolean"
          ? { isActive: params.isActive }
          : {}),
        ...(params.q
          ? { OR: [{ email: { contains: params.q, mode: "insensitive" } }] }
          : {}),
      },
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),

  countUsers: (params: { role?: Role; isActive?: boolean; q?: string }) =>
    prisma.user.count({
      where: {
        deletedAt: null,
        ...(params.role ? { role: params.role } : {}),
        ...(typeof params.isActive === "boolean"
          ? { isActive: params.isActive }
          : {}),
        ...(params.q
          ? { OR: [{ email: { contains: params.q, mode: "insensitive" } }] }
          : {}),
      },
    }),

  setUserActive: (id: string, isActive: boolean) =>
    prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, isActive: true },
    }),

  createSpecialty: (data: { name: string; description?: string }) =>
    prisma.specialty.create({
      data: { name: data.name, description: data.description },
      select: { id: true, name: true, description: true, createdAt: true },
    }),

  analytics: async () => {
    const [users, doctors, apptsByStatus] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.doctorProfile.count({ where: { deletedAt: null } }),
      prisma.appointment.groupBy({
        by: ["status"],
        _count: { status: true },
        where: { deletedAt: null },
      }),
    ]);
    return { users, doctors, apptsByStatus };
  },
};
