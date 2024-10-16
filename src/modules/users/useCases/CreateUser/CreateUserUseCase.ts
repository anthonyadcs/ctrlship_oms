import { comparePasswords } from "@utils/comparePasswords";
import bcrypt from "bcrypt";
import UserRepository from "../../repositories/UserRepository";

interface IRequest {
	createrUser: {
		email: string;
		password: string;
	};
	createdUser: {
		name: string;
		email: string;
		passwordHash: string;
		roleName: string;
	};
}
class CreateUserUseCase {
	async execute({ createrUser, createdUser }: IRequest) {
		const createdUserExists = await UserRepository.findByEmail(createdUser.email);
		const createrUserExists = await UserRepository.findByEmail(createrUser.email);

		if (createrUserExists && !createdUserExists) {
			//Verifica se o usuário tem permissão para atualizar usuários
			const permissions = await UserRepository.findPermission(createrUserExists.roleName);

			const permissionToCreate = permissions.find((permission) => {
				return permission.name === "create_user_admin" || permission.name === "create_user_company";
			});

			if (
				permissionToCreate === undefined ||
				(permissionToCreate.name === "create_user_company" &&
					createdUserExists.roleName === "admin")
			) {
				return {
					status: 403,
					message: "Você não possui permissão para cadastrar este usuário.",
				};
			}
		} else {
			return {
				status: 404,
				message: "Usuário a atualizar ou usuário atualizador não encontrados.",
			};
		}

		if (!comparePasswords(createrUserExists.passwordHash, createrUser.password)) {
			return {
				status: 401,
				message: "Email ou senha  do usuário atualizador incorretos.",
			};
		}

		for (const value in createdUser) {
			if (!createdUser[value]) {
				return {
					status: 400,
					message: "Todos os campos devem ser preenchidos.",
				};
			}
		}

		const newPasswordHash = await bcrypt.hash(createdUser.passwordHash, 10);

		createdUser.passwordHash = newPasswordHash;

		try {
			await UserRepository.createUser(createdUser);
		} catch (error) {
			return {
				status: 500,
				message: error,
			};
		}

		return {
			status: 201,
			message: "Usuário criado com sucesso.",
		};
	}
}

export { CreateUserUseCase };
