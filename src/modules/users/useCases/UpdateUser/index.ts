import { UpdateUserController } from "./UpdateUserController";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

const updateUserUseCase = new UpdateUserUseCase();
const updateUserController = new UpdateUserController(updateUserUseCase);

export { updateUserController };
