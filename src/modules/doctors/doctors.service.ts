import { ok } from "../../utils/apiResponse";
import { Errors } from "../../utils/errors";
import { DoctorsRepo } from "./doctors.repo";
import { prisma } from "../../prisma/client";

function overlaps(
  a: { startTime: Date; endTime: Date },
  b: { startTime: Date; endTime: Date },
) {
  return a.startTime < b.endTime && a.endTime > b.startTime;
}

export async function listDoctors(params: {
  page: number;
  limit: number;
  q?: string;
  specialtyId?: string;
}) {
  const skip = (params.page - 1) * params.limit;
  const [items, total] = await Promise.all([
    DoctorsRepo.listDoctors({
      skip,
      take: params.limit,
      q: params.q,
      specialtyId: params.specialtyId,
    }),
    DoctorsRepo.countDoctors({ q: params.q, specialtyId: params.specialtyId }),
  ]);

  const payload = { items, page: params.page, limit: params.limit, total };
  return ok("Doctors", payload);
}

export async function getDoctor(id: string) {
  const doctor = await DoctorsRepo.getDoctorById(id);
  if (!doctor) throw Errors.notFound("Doctor not found");
  return ok("Doctor", doctor);
}

export async function getDoctorAvailability(doctorId: string) {
  const doctor = await prisma.doctorProfile.findFirst({
    where: {
      id: doctorId,
      deletedAt: null,
      specialty: { deletedAt: null },
      user: { deletedAt: null, isActive: true },
    },
    select: { id: true },
  });
  if (!doctor) throw Errors.notFound("Doctor not found");

  const items = await prisma.availabilitySlot.findMany({
    where: {
      doctorId,
      deletedAt: null,
      isBooked: false,
      startTime: { gte: new Date(Date.now() - 60_000) },
    },
    orderBy: { startTime: "asc" },
    select: { id: true, startTime: true, endTime: true },
  });

  return ok("Availability", { items });
}

export async function createAvailability(
  userId: string,
  slots: Array<{ startTime: Date; endTime: Date }>,
) {
  const profile = await DoctorsRepo.findDoctorProfileByUserId(userId);
  if (!profile) throw Errors.notFound("Doctor profile not found");

  const normalized = slots
    .map((s) => ({
      startTime: new Date(s.startTime),
      endTime: new Date(s.endTime),
    }))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  for (const s of normalized) {
    if (!(s.startTime instanceof Date) || isNaN(s.startTime.getTime()))
      throw Errors.badRequest("Invalid startTime");
    if (!(s.endTime instanceof Date) || isNaN(s.endTime.getTime()))
      throw Errors.badRequest("Invalid endTime");
    if (s.endTime <= s.startTime)
      throw Errors.badRequest("endTime must be after startTime");
  }

  for (let i = 1; i < normalized.length; i++) {
    if (overlaps(normalized[i - 1], normalized[i]))
      throw Errors.conflict("Slots overlap each other");
  }

  const minStart = normalized[0].startTime;
  const maxEnd = normalized[normalized.length - 1].endTime;
  const existing = await DoctorsRepo.existingSlotsForOverlap(
    profile.id,
    minStart,
    maxEnd,
  );
  for (const s of normalized) {
    if (existing.some((e: any) => overlaps(s, e))) {
      throw Errors.conflict("Overlaps existing availability slot");
    }
  }

  const created = await DoctorsRepo.createSlots(profile.id, normalized);
  return ok("Availability created", { createdCount: created.count });
}

export async function getDoctorAppointments(userId: string) {
  const profile = await DoctorsRepo.findDoctorProfileByUserId(userId);
  if (!profile) throw Errors.notFound("Doctor profile not found");

  // upcoming incl. pending/confirmed
  const items = await prisma.appointment.findMany({
    where: {
      doctorId: profile.id,
      deletedAt: null,
      status: { in: ["PENDING", "CONFIRMED"] },
      appointmentDate: { gte: new Date(Date.now() - 60_000) },
    },
    orderBy: { appointmentDate: "asc" },
    select: {
      id: true,
      status: true,
      appointmentDate: true,
      notes: true,
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      slot: { select: { startTime: true, endTime: true } },
    },
  });

  return ok("Doctor appointments", { items });
}
