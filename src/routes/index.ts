import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { doctorsRouter } from "../modules/doctors/doctors.routes";
import { appointmentsRouter } from "../modules/appointments/appointments.routes";
import { adminRouter } from "../modules/admin/admin.routes";
import { usersRouter } from "../modules/users/users.routes";
import { specialtiesRouter } from "../modules/specialties/specialties.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/doctors", doctorsRouter);
apiRouter.use("/specialties", specialtiesRouter);
apiRouter.use("/appointments", appointmentsRouter);
apiRouter.use("/admin", adminRouter);
