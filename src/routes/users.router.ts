import { Router } from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

import UserController from "../controller/UserController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/", userController.create);
userRoutes.put("/:id", ensureAuthenticated, userController.update);
userRoutes.post("/login", ensureAuthenticated, userController.authenticate); // Nova rota para login


export default userRoutes;
