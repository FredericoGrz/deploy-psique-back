import { Router } from "express";
import { SessionRecordsController } from "../controller/SessionRecordsController";

const sessionRecordsRoutes = Router();
const sessionRecordsController = new SessionRecordsController();

sessionRecordsRoutes.post("/patients/:patient_id/sessions", sessionRecordsController.create);
sessionRecordsRoutes.get("/patients/:patient_id/sessions", sessionRecordsController.index);

export default sessionRecordsRoutes;
