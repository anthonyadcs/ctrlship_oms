import { Router } from "express";
import { createUserController } from "../useCases/CreateUser/index";

export const userRoutes = Router();

userRoutes.post("/user", (request, response) => {
	return createUserController.handle(request, response);
});
