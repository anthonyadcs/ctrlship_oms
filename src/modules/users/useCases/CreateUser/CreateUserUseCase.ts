import { User } from "@prisma/client";
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
		let createrUserData: User;
		let createdUserData: User;

		try {
			const createdUserExists = await UserRepository.findByEmail(createdUser.email);

			if (createdUserExists) {
				throw new Error("O usuário já está cadastrado no servidor.");
			}

			const createrUserExists = await UserRepository.findByEmail(createrUser.email);

			if (!createrUserExists) {
				throw new Error(
					"O usuário administrador não foi desta operação não foi encontrado no servidor",
				);
			}

			createrUserData = createrUserExists;
			createdUserData = createdUserExists;
		} catch (error) {
			return {
				status: 409,
				message: error.message,
			};
		}

		try {
			const permissions = await UserRepository.findPermission(createrUserData.roleName);

			const neededPermissions = permissions.some(
				(permission) =>
					permission.name === "create_user_admin" || permission.name === "create_user_company",
			);

			const passwordMatch = await comparePasswords(
				createrUser.password,
				createrUserData.passwordHash,
			);

			if (!neededPermissions || !passwordMatch) {
				return {
					status: 403,
					message:
						"O usuário administrador não possui as permissões necessárias no servidor para finalizar esta ação.",
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error.message,
			};
		}

		try {
			createdUser.passwordHash = await bcrypt.hash(createdUser.passwordHash, 10);
			await UserRepository.createUser(createdUser);

			return {
				status: 201,
				message: "Usuário criado com sucesso.",
			};
		} catch (error) {
			return {
				status: 500,
				message: error.message,
			};
		}
	}
}

export { CreateUserUseCase };
