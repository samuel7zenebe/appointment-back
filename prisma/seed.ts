import bcrypt from "bcryptjs";
import { Role, AppointmentStatus } from "../src/generated/prisma";
import { prisma } from "../src/prisma/client";

async function main() {
  const specialties = [
    {
      name: "General Practice",
      description: "Primary care and general consultations",
    },
    { name: "Dermatology", description: "Skin, hair and nail health" },
    { name: "Cardiology", description: "Heart and cardiovascular system" },
    { name: "Pediatrics", description: "Child and adolescent healthcare" },
    { name: "Orthopedics", description: "Bone, joint and muscle health" },
    { name: "Neurology", description: "Brain and nervous system disorders" },
  ];

  for (const s of specialties) {
    await prisma.specialty.upsert({
      where: { name: s.name },
      update: { description: s.description, deletedAt: null },
      create: s,
    });
  }

  const adminPassword = await bcrypt.hash("ChangeMe123!", 12);
  const doctorPassword = await bcrypt.hash("Doctor123!", 12);
  const patientPassword = await bcrypt.hash("Patient123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: Role.ADMIN, isActive: true, deletedAt: null },
    create: {
      firstName: "System",
      lastName: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const doctors = [];
  const doctorData = [
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      specialty: "General Practice",
      bio: "Experienced family physician",
      experience: 10,
      fee: 100,
    },
    {
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.johnson@example.com",
      specialty: "Dermatology",
      bio: "Skin care specialist",
      experience: 8,
      fee: 150,
    },
    {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
      specialty: "Cardiology",
      bio: "Heart health expert",
      experience: 15,
      fee: 200,
    },
    {
      firstName: "Sarah",
      lastName: "Davis",
      email: "sarah.davis@example.com",
      specialty: "Pediatrics",
      bio: "Children's healthcare specialist",
      experience: 7,
      fee: 120,
    },
    {
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@example.com",
      specialty: "Orthopedics",
      bio: "Bone and joint specialist",
      experience: 12,
      fee: 180,
    },
  ];

  for (const doc of doctorData) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: { role: Role.DOCTOR, isActive: true, deletedAt: null },
      create: {
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        password: doctorPassword,
        role: Role.DOCTOR,
        isActive: true,
      },
    });

    const specialty = await prisma.specialty.findUnique({
      where: { name: doc.specialty },
    });

    const profile = await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {
        specialtyId: specialty!.id,
        bio: doc.bio,
        experienceYears: doc.experience,
        consultationFee: doc.fee,
        deletedAt: null,
      },
      create: {
        userId: user.id,
        specialtyId: specialty!.id,
        bio: doc.bio,
        experienceYears: doc.experience,
        consultationFee: doc.fee,
      },
    });

    doctors.push({ userId: user.id, profileId: profile.id });
  }

  const patients = [];
  const patientData = [
    {
      firstName: "Alice",
      lastName: "Williams",
      email: "alice.williams@example.com",
    },
    { firstName: "Bob", lastName: "Taylor", email: "bob.taylor@example.com" },
    {
      firstName: "Carol",
      lastName: "Anderson",
      email: "carol.anderson@example.com",
    },
  ];

  for (const pat of patientData) {
    const user = await prisma.user.upsert({
      where: { email: pat.email },
      update: { role: Role.PATIENT, isActive: true, deletedAt: null },
      create: {
        firstName: pat.firstName,
        lastName: pat.lastName,
        email: pat.email,
        password: patientPassword,
        role: Role.PATIENT,
        isActive: true,
      },
    });
    patients.push(user);
  }

  const now = new Date();
  for (const doc of doctors) {
    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const slotDate = new Date(now);
      slotDate.setDate(now.getDate() + dayOffset);
      slotDate.setHours(9, 0, 0, 0);

      const slotEndTime = new Date(slotDate);
      slotEndTime.setHours(10, 0, 0, 0);

      await prisma.availabilitySlot.upsert({
        where: {
          doctorId_startTime_endTime: {
            doctorId: doc.profileId,
            startTime: slotDate,
            endTime: slotEndTime,
          },
        },
        update: { isBooked: false, deletedAt: null },
        create: {
          doctorId: doc.profileId,
          startTime: slotDate,
          endTime: slotEndTime,
        },
      });
    }
  }

  const firstDoctorId = doctors[0].profileId;
  const firstPatientId = patients[0].id;
  const availableSlot = await prisma.availabilitySlot.findFirst({
    where: { doctorId: firstDoctorId, isBooked: false },
  });

  if (availableSlot) {
    await prisma.appointment.create({
      data: {
        patientId: firstPatientId,
        doctorId: firstDoctorId,
        slotId: availableSlot.id,
        status: AppointmentStatus.CONFIRMED,
        appointmentDate: availableSlot.startTime,
        notes: "Regular checkup",
      },
    });
    await prisma.availabilitySlot.update({
      where: { id: availableSlot.id },
      data: { isBooked: true },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
