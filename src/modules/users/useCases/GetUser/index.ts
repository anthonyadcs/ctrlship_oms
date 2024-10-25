import { userRepository } from "@modules/users/repositories/index";
import { GetUserController } from "./GetUserController";
import { GetUserUseCase } from "./GetUserUseCase";

const getUserUseCase = new GetUserUseCase(userRepository);
const getUserController = new GetUserController(getUserUseCase);

export { getUserController };
