import { Router } from "express";
import { createUserController } from "../modules/users/useCases/CreateUser/index";
import { deleteUserController } from "../modules/users/useCases/DeleteUser/index";
import { getSessionDataController } from "../modules/users/useCases/GetSessionData/index";
import { loginUserController } from "../modules/users/useCases/LoginUser/index";
import { updateUserController } from "../modules/users/useCases/UpdateUser/index";

const userRoutes = Router();

// @ts-ignore
userRoutes.post("/user", async (request, response) => {
	return await createUserController.handle(request, response);
});

// @ts-ignore
userRoutes.patch("/user", async (request, response) => {
	return await updateUserController.handle(request, response);
});

// @ts-ignore
userRoutes.delete("/user", async (request, response) => {
	return await deleteUserController.handle(request, response);
});

//@ts-ignore
userRoutes.post("/user/login", async (request, response) => {
	return await loginUserController.handle(request, response);
});

userRoutes.get("/user/session", async (request, response) => {
	return await getSessionDataController.handle(request, response);
});

export { userRoutes };
