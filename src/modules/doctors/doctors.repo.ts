import { prisma } from "../../prisma/client";

export const DoctorsRepo = {
  findDoctorProfileByUserId: (userId: string) =>
    prisma.doctorProfile.findFirst({
      where: { userId, deletedAt: null, user: { deletedAt: null } },
      select: { id: true, userId: true },
    }),

  listDoctors: (params: { skip: number; take: number; q?: string; specialtyId?: string }) =>
    prisma.doctorProfile.findMany({
      where: {
        deletedAt: null,
        specialty: { deletedAt: null },
        user: {
          deletedAt: null,
          isActive: true,
        },
        ...(params.q
          ? {
              OR: [
                { user: { firstName: { contains: params.q, mode: "insensitive" } } },
                { user: { lastName: { contains: params.q, mode: "insensitive" } } },
                { specialty: { name: { contains: params.q, mode: "insensitive" } } },
              ],
            }
          : {}),
        ...(params.specialtyId ? { specialtyId: params.specialtyId } : {}),
      },
      skip: params.skip,
      take: params.take,
      orderBy: { rating: "desc" },
      select: {
        id: true,
        bio: true,
        experienceYears: true,
        consultationFee: true,
        clinicAddress: true,
        rating: true,
        user: { select: { firstName: true, lastName: true, email: true, profileImage: true } },
        specialty: { select: { id: true, name: true } },
      },
    }),

  countDoctors: (params: { q?: string; specialtyId?: string }) =>
    prisma.doctorProfile.count({
      where: {
        deletedAt: null,
        specialty: { deletedAt: null },
        user: {
          deletedAt: null,
          isActive: true,
        },
        ...(params.q
          ? {
              OR: [
                { user: { firstName: { contains: params.q, mode: "insensitive" } } },
                { user: { lastName: { contains: params.q, mode: "insensitive" } } },
                { specialty: { name: { contains: params.q, mode: "insensitive" } } },
              ],
            }
          : {}),
        ...(params.specialtyId ? { specialtyId: params.specialtyId } : {}),
      },
    }),

  getDoctorById: (id: string) =>
    prisma.doctorProfile.findFirst({
      where: { id, deletedAt: null, user: { deletedAt: null, isActive: true }, specialty: { deletedAt: null } },
      select: {
        id: true,
        bio: true,
        experienceYears: true,
        consultationFee: true,
        clinicAddress: true,
        rating: true,
        user: { select: { firstName: true, lastName: true, email: true, profileImage: true } },
        specialty: { select: { id: true, name: true, description: true } },
      },
    }),

  existingSlotsForOverlap: (doctorId: string, minStart: Date, maxEnd: Date) =>
    prisma.availabilitySlot.findMany({
      where: {
        doctorId,
        deletedAt: null,
        startTime: { lt: maxEnd },
        endTime: { gt: minStart },
      },
      select: { id: true, startTime: true, endTime: true, isBooked: true },
    }),

  createSlots: (doctorId: string, slots: Array<{ startTime: Date; endTime: Date }>) =>
    prisma.availabilitySlot.createMany({
      data: slots.map((s) => ({ doctorId, startTime: s.startTime, endTime: s.endTime })),
      skipDuplicates: true,
    }),
};
