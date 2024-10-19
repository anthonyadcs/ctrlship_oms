import { userRepository } from "@modules/users/repositories/index";
import { GetSessionDataController } from "./GetSessionDataController";
import { GetSessionDataUseCase } from "./GetSessionDataUseCase";

const getSessionDataUseCase = new GetSessionDataUseCase(userRepository);
const getSessionDataController = new GetSessionDataController(getSessionDataUseCase);

export { getSessionDataController };
