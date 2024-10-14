import bcrypt from "bcrypt";
import UserRepository from "../../repositories/UserRepository";
import { createUserController } from "./index";

interface IRequest {
	name: string;
	email: string;
	password: string;
	roleName: string;
}

class CreateUserUseCase {
	async execute({ name, email, password, roleName }: IRequest) {
		const userExists = await UserRepository.findByEmail({ email });
		console.log(userExists);

		if (userExists) {
			console.log(userExists);
			return {
				status: 409,
				message: "Usuário já cadastrado",
			};
		}

		const passwordHash = await bcrypt.hash(password, 10);

		try {
			await UserRepository.createUser({ name, email, passwordHash, roleName });
			return {
				status: 201,
				message: "Usuário criado com sucesso",
			};
		} catch (error) {
			return {
				status: 500,
				message: "Falha ao salvar o usuário",
				errorMessage: error.message,
			};
		}
	}
}

export { CreateUserUseCase };
