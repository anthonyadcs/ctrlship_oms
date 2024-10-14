import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";
import  UserRepository from '../../repositories/UserRepository'

const createUserUseCase = new CreateUserUseCase()
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
