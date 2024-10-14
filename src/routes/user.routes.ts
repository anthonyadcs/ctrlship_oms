import { Router } from "express";
import { createUserController } from "../modules/users/useCases/CreateUser/index";

export const userRoutes = Router();

userRoutes.post("/user", (request, response) => {
	return createUserController.handle(request, response);
});
