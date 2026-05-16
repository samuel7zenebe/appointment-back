import { prisma } from "../../prisma/client";

export const UsersRepo = {
  findById: (id: string) =>
    prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phoneNumber: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

  updateById: (id: string, data: { firstName?: string; lastName?: string; phoneNumber?: string; profileImage?: string }) =>
    prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phoneNumber: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
};

