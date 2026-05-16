import { ok } from "../../utils/apiResponse";
import { SpecialtiesRepo } from "./specialties.repo";

export async function listSpecialties() {
  const items = await SpecialtiesRepo.listSpecialties();
  return ok("Specialties", { items });
}

