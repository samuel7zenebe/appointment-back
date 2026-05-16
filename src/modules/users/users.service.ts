import { ok } from "../../utils/apiResponse";
import { Errors } from "../../utils/errors";
import { UsersRepo } from "./users.repo";

export async function getMe(userId: string) {
  const user = await UsersRepo.findById(userId);
  if (!user) throw Errors.notFound("User not found");
  return ok("Me", user);
}

export async function updateMe(
  userId: string,
  data: { firstName?: string; lastName?: string; phoneNumber?: string; profileImage?: string },
) {
  const user = await UsersRepo.updateById(userId, data);
  return ok("Profile updated", user);
}

