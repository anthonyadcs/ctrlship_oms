import { Router } from "express";
import { createUserController } from "../modules/users/useCases/CreateUser/index";
import { updateUserController } from "../modules/users/useCases/UpdateUser/index";

const userRoutes = Router();

userRoutes.post("/user", async (request, response) => {
	return await createUserController.handle(request, response);
});

userRoutes.patch("/user", async (request, response) => {
	return await updateUserController.handle(request, response);
});

export { userRoutes };
