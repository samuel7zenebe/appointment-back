import { AppointmentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";

export const AppointmentsRepo = {
  findSlotById: (slotId: string) =>
    prisma.availabilitySlot.findFirst({
      where: { id: slotId, deletedAt: null, doctor: { deletedAt: null, user: { deletedAt: null, isActive: true } } },
      select: { id: true, doctorId: true, startTime: true, endTime: true, isBooked: true },
    }),

  findOverlappingPatientAppointments: (patientId: string, startTime: Date, endTime: Date) =>
    prisma.appointment.findFirst({
      where: {
        patientId,
        deletedAt: null,
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
        slot: { deletedAt: null, startTime: { lt: endTime }, endTime: { gt: startTime } },
      },
      select: { id: true },
    }),

  markSlotBooked: (tx: Prisma.TransactionClient, slotId: string) =>
    tx.availabilitySlot.updateMany({
      where: { id: slotId, deletedAt: null, isBooked: false },
      data: { isBooked: true },
    }),

  freeSlot: (tx: Prisma.TransactionClient, slotId: string) =>
    tx.availabilitySlot.updateMany({
      where: { id: slotId, deletedAt: null },
      data: { isBooked: false },
    }),

  createAppointment: (tx: Prisma.TransactionClient, data: { patientId: string; doctorId: string; slotId: string; notes?: string }) =>
    tx.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        slotId: data.slotId,
        appointmentDate: new Date(),
        notes: data.notes,
      },
      select: { id: true, status: true, appointmentDate: true },
    }),

  findAppointmentForPatient: (id: string, patientId: string) =>
    prisma.appointment.findFirst({
      where: { id, patientId, deletedAt: null },
      select: { id: true, status: true, slotId: true, doctorId: true, appointmentDate: true },
    }),

  findAppointmentForDoctor: (id: string, doctorId: string) =>
    prisma.appointment.findFirst({
      where: { id, doctorId, deletedAt: null },
      select: { id: true, status: true, slotId: true, patientId: true, appointmentDate: true },
    }),

  listMyAppointments: (patientId: string, params: { skip: number; take: number; status?: AppointmentStatus }) =>
    prisma.appointment.findMany({
      where: { patientId, deletedAt: null, ...(params.status ? { status: params.status } : {}) },
      orderBy: { appointmentDate: "desc" },
      skip: params.skip,
      take: params.take,
      select: {
        id: true,
        status: true,
        appointmentDate: true,
        notes: true,
        cancellationReason: true,
        slot: { select: { startTime: true, endTime: true } },
        doctor: {
          select: {
            id: true,
            specialty: { select: { name: true } },
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
    }),

  countMyAppointments: (patientId: string, status?: AppointmentStatus) =>
    prisma.appointment.count({ where: { patientId, deletedAt: null, ...(status ? { status } : {}) } }),
};

