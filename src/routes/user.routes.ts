import { Router } from "express";
import { createUserController } from "../modules/users/useCases/CreateUser/index";
import { updateUserController } from "../modules/users/useCases/UpdateUser/index";

export const userRoutes = Router();

userRoutes.post("/user", (request, response) => {
	return createUserController.handle(request, response);
});

userRoutes.patch("/user", (request, response) => {
	return updateUserController.handle(request, response);
});
