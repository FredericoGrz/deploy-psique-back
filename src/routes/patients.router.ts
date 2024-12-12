import { Router } from "express";
import PatientController from "../controller/PatientController";

const patientRoutes = Router();
const patientController = new PatientController();

patientRoutes.get("/", patientController.index);
patientRoutes.get("/:id", patientController.show);
patientRoutes.post("/", patientController.create);
patientRoutes.post("/sessions", patientController.addSession);
patientRoutes.put("/:id", patientController.update);
patientRoutes.delete("/:id", patientController.delete);
patientRoutes.post("/login", patientController.login.bind(patientController)); 
patientRoutes.get("/:patient_id/notifications", patientController.getNotifications);

export default patientRoutes;
