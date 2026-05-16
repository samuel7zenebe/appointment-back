import { AppointmentStatus, Prisma, Role } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { ok } from "../../utils/apiResponse";
import { Errors } from "../../utils/errors";
import { AppointmentsRepo } from "./appointments.repo";
import { DoctorsRepo } from "../doctors/doctors.repo";

async function runSerializable<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (err?.code === "P2034" && attempt <= maxRetries) continue;
      throw err;
    }
  }
}

export async function bookAppointment(patientUserId: string, input: { slotId: string; notes?: string }) {
  const patient = await prisma.user.findFirst({
    where: { id: patientUserId, deletedAt: null, isActive: true },
    select: { email: true, firstName: true, lastName: true },
  });
  if (!patient) throw Errors.unauthorized("Invalid patient");

  const created = await runSerializable(async () =>
    prisma.$transaction(
      async (tx) => {
        const slot = await tx.availabilitySlot.findFirst({
          where: {
            id: input.slotId,
            deletedAt: null,
            doctor: { deletedAt: null, user: { deletedAt: null, isActive: true } },
          },
          select: { id: true, doctorId: true, startTime: true, endTime: true, isBooked: true },
        });
        if (!slot) throw Errors.notFound("Availability slot not found");
        if (slot.isBooked) throw Errors.conflict("Slot already booked");
        if (slot.startTime.getTime() < Date.now()) throw Errors.badRequest("Cannot book past slot");

        const existingOverlap = await tx.appointment.findFirst({
          where: {
            patientId: patientUserId,
            deletedAt: null,
            status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
            slot: { deletedAt: null, startTime: { lt: slot.endTime }, endTime: { gt: slot.startTime } },
          },
          select: { id: true },
        });
        if (existingOverlap) throw Errors.conflict("Patient already has an overlapping appointment");

        const updated = await AppointmentsRepo.markSlotBooked(tx, slot.id);
        if (updated.count !== 1) throw Errors.conflict("Slot already booked");

        const appointment = await tx.appointment.create({
          data: {
            patientId: patientUserId,
            doctorId: slot.doctorId,
            slotId: slot.id,
            appointmentDate: slot.startTime,
            notes: input.notes,
            status: AppointmentStatus.PENDING,
          },
          select: { id: true, status: true, appointmentDate: true },
        });

        return { appointment, slotStart: slot.startTime };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    ),
  );

  return ok("Appointment booked", created.appointment);
}

export async function myAppointments(patientUserId: string, params: { page: number; limit: number; status?: AppointmentStatus }) {
  const skip = (params.page - 1) * params.limit;
  const [items, total] = await Promise.all([
    AppointmentsRepo.listMyAppointments(patientUserId, { skip, take: params.limit, status: params.status }),
    AppointmentsRepo.countMyAppointments(patientUserId, params.status),
  ]);
  return ok("My appointments", { items, page: params.page, limit: params.limit, total });
}

export async function cancelAppointment(patientUserId: string, appointmentId: string, cancellationReason: string) {
  const appt = await AppointmentsRepo.findAppointmentForPatient(appointmentId, patientUserId);
  if (!appt) throw Errors.notFound("Appointment not found");
  if (appt.status === AppointmentStatus.COMPLETED) throw Errors.conflict("Completed appointments cannot be cancelled");
  if (appt.status === AppointmentStatus.CANCELLED) return ok("Already cancelled", { id: appt.id, status: appt.status });
  if (appt.status === AppointmentStatus.REJECTED) throw Errors.conflict("Rejected appointments cannot be cancelled");

  await prisma.$transaction(
    async (tx) => {
      await tx.appointment.update({
        where: { id: appt.id },
        data: { status: AppointmentStatus.CANCELLED, cancellationReason },
      });
      await AppointmentsRepo.freeSlot(tx, appt.slotId);
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  return ok("Cancelled", { id: appt.id, status: AppointmentStatus.CANCELLED });
}

export async function updateAppointmentStatus(params: {
  actor: { userId: string; role: Role };
  appointmentId: string;
  status: AppointmentStatus;
}) {
  if (params.actor.role !== Role.DOCTOR && params.actor.role !== Role.ADMIN) throw Errors.forbidden();

  const next = params.status;
  const allowed: AppointmentStatus[] = [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.REJECTED,
    AppointmentStatus.COMPLETED,
  ];
  if (!allowed.includes(next)) {
    throw Errors.badRequest("Unsupported status transition via this endpoint");
  }

  const doctorProfile =
    params.actor.role === Role.DOCTOR ? await DoctorsRepo.findDoctorProfileByUserId(params.actor.userId) : null;
  const doctorId = doctorProfile?.id;
  if (params.actor.role === Role.DOCTOR && !doctorId) throw Errors.forbidden("Doctor profile required");

  const appt = await prisma.appointment.findFirst({
    where: {
      id: params.appointmentId,
      deletedAt: null,
      ...(doctorId ? { doctorId } : {}),
    },
    select: { id: true, status: true, slotId: true },
  });
  if (!appt) throw Errors.notFound("Appointment not found");

  const current = appt.status;
  if (current === AppointmentStatus.CANCELLED) throw Errors.conflict("Cancelled appointments cannot be updated");
  if (current === AppointmentStatus.COMPLETED) throw Errors.conflict("Completed appointments cannot be updated");

  if (next === AppointmentStatus.CONFIRMED && current !== AppointmentStatus.PENDING) {
    throw Errors.conflict("Only pending appointments can be confirmed");
  }
  if (next === AppointmentStatus.REJECTED && current !== AppointmentStatus.PENDING) {
    throw Errors.conflict("Only pending appointments can be rejected");
  }
  if (next === AppointmentStatus.COMPLETED && current !== AppointmentStatus.CONFIRMED) {
    throw Errors.conflict("Only confirmed appointments can be completed");
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.appointment.update({ where: { id: appt.id }, data: { status: next } });
      if (next === AppointmentStatus.REJECTED) {
        await AppointmentsRepo.freeSlot(tx, appt.slotId);
      }
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  return ok("Status updated", { id: appt.id, status: next });
}
