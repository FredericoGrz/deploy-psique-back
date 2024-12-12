import { Router } from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

import userRoutes from "./users.router";
import sessionsRoutes from "./sessions.router";
import patientsRoutes from "./patients.router";
import schedulesRoutes from "./schedules.router";
import sessionRecordsRoutes from "./sessionRecords.router";


const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/patients", ensureAuthenticated, patientsRoutes);
routes.use("/schedules", ensureAuthenticated, schedulesRoutes);
routes.use(sessionRecordsRoutes);


export default routes;
