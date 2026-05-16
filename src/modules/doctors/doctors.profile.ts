import { prisma } from "../../prisma/client";
import { Errors } from "../../utils/errors";
import { ok } from "../../utils/apiResponse";
import { DoctorsRepo } from "./doctors.repo";

export async function updateMyDoctorProfile(
  userId: string,
  data: { specialtyId?: string; bio?: string; experienceYears?: number; consultationFee?: number; clinicAddress?: string },
) {
  const profile = await DoctorsRepo.findDoctorProfileByUserId(userId);
  if (!profile) throw Errors.notFound("Doctor profile not found");

  const updated = await prisma.doctorProfile.update({
    where: { id: profile.id },
    data,
    select: {
      id: true,
      specialtyId: true,
      bio: true,
      experienceYears: true,
      consultationFee: true,
      clinicAddress: true,
      rating: true,
      updatedAt: true,
    },
  });
  return ok("Doctor profile updated", updated);
}
