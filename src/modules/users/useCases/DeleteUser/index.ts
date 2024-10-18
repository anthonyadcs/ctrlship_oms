import { userRepository } from "@modules/users/repositories/index";
import { DeleteUserController } from "./DeleteUserController";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export { deleteUserController, DeleteUserUseCase };
