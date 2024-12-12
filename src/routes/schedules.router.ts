import { Router } from "express";
import ScheduleController from "../controller/ScheduleController";

const scheduleRoutes = Router();
const scheduleController = new ScheduleController();

scheduleRoutes.get("/", scheduleController.index);
scheduleRoutes.post("/", scheduleController.create);
scheduleRoutes.put("/:id", scheduleController.update);
scheduleRoutes.delete("/:id", scheduleController.delete);

export default scheduleRoutes;
