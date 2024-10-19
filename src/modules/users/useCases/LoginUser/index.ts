import { userRepository } from "@modules/users/repositories/index";
import { LoginUserController } from "./LoginUserController";
import { LoginUserUseCase } from "./LoginUserUseCase";

const loginUserUseCase = new LoginUserUseCase(userRepository);
const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController };
