import { prisma } from "../../prisma/client";
import { Errors } from "../../utils/errors";
import { hashPassword, verifyPassword } from "../../utils/password";
import { ok } from "../../utils/apiResponse";
import { signAccessToken } from "../../utils/jwt";
import { Role } from "../../generated/prisma";

export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: Role;
  specialtyId?: string;
}) {
  const role = input.role ?? Role.PATIENT;
  const passwordHash = await hashPassword(input.password);

  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.toLowerCase(),
        password: passwordHash,
        phoneNumber: input.phoneNumber,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    if (role === Role.DOCTOR) {
      if (!input.specialtyId)
        throw Errors.badRequest("specialtyId is required for doctors");
      await tx.doctorProfile.create({
        data: {
          userId: user.id,
          specialtyId: input.specialtyId,
        },
      });
    }

    return user;
  });

  return ok("Registered", created);
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findFirst({
    where: { email: input.email.toLowerCase(), deletedAt: null },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
      firstName: true,
      lastName: true,
    },
  });
  if (!user) throw Errors.unauthorized("Invalid credentials");
  if (!user.isActive) throw Errors.unauthorized("Account is suspended");

  const match = await verifyPassword(input.password, user.password);
  if (!match) throw Errors.unauthorized("Invalid credentials");

  const accessToken = signAccessToken({ sub: user.id, role: user.role });

  return ok("Logged in", {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    accessToken,
  });
}
