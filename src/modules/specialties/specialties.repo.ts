import { prisma } from "../../prisma/client";

export const SpecialtiesRepo = {
  listSpecialties: () =>
    prisma.specialty.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true },
    }),
};

