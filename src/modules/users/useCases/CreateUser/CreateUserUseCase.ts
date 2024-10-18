import { UserRepository } from "@modules/users/repositories/UserRepository";
import { ICreateUserDTO } from "@modules/users/repositories/interfaces/IUserRepository";
import { User } from "@prisma/client";
import { comparePasswords } from "@utils/comparePasswords";
import { createSlugId } from "@utils/createSlugId";
import bcrypt from "bcrypt";

type IRequest = {
	createrUser: {
		id: string;
		email: string;
		password: string;
	};
	createdUser: {
		name: string;
		email: string;
		password: string;
		roleName: string;
		companyId: string;
	};
};
class CreateUserUseCase {
	constructor(private userRepository: UserRepository) {}
	async execute({ createrUser, createdUser }: IRequest) {
		let createrUserData: User;
		let slugId: User["slugId"];

		try {
			const createdUserExists = await this.userRepository.findByEmail(createdUser.email);

			if (createdUserExists) {
				throw new Error("O usuário já está cadastrado no servidor.");
			}

			if (
				createdUser.roleName === "general_admin" ||
				(createdUser.roleName === "company_admin" && createrUserData.roleName === "company_admin")
			) {
				throw new Error(
					"O usuário administrador não possui permissão para criar um usuário com esta ocupação no servidor.",
				);
			}

			const createrUserExists = await this.userRepository.findById(createrUser.id);

			if (!createrUserExists) {
				throw new Error("O usuário administrador desta operação não foi encontrado no servidor.");
			}

			createrUserData = createrUserExists;
		} catch (error: any) {
			return {
				status: 409,
				message: error.message,
			};
		}

		try {
			const permissions = await this.userRepository.findPermission(createrUserData.roleName);

			const neededPermissions = permissions.some(
				(permission) =>
					permission.name === "create_user_general_admin" ||
					permission.name === "create_user_company_admin",
			);

			const passwordMatch = await comparePasswords(
				createrUser.password,
				createrUserData.passwordHash,
			);

			if (!passwordMatch || createrUser.email !== createrUserData.email) {
				return {
					status: 409,
					message: "Os dados do usuário administrador não conferem.",
				};
			}

			if (!neededPermissions) {
				return {
					status: 403,
					message:
						"O usuário administrador não possui as permissões necessárias no servidor para finalizar esta ação.",
				};
			}

			if (createrUserData.companyId !== createdUser.companyId) {
				return {
					status: 400,
					message:
						"O usuário administrador não possui as permissões necessárias no servidor para finalizar esta ação.",
				};
			}
		} catch (error: any) {
			return {
				status: 500,
				message: error.message,
			};
		}

		try {
			const uniqueHash = `${createdUser.name.split(" ")[0]}_${createdUser.email.split("@")[0]}_${createdUser.roleName.split("_")[0]}_${createdUser.password}`;

			slugId = createSlugId(uniqueHash, 8);

			const createdUserExists = await this.userRepository.findBySlugId(slugId);

			if (createdUserExists && createdUserExists.companyId === createdUser.companyId) {
				throw new Error("O usuário já está cadastrado no servidor.");
			}
		} catch (error: any) {
			return {
				status: 409,
				message: error.message,
			};
		}

		const newUser: ICreateUserDTO = {
			slugId,
			name: createdUser.name,
			email: createdUser.email,
			passwordHash: await bcrypt.hash(createdUser.password, 10),
			companyId: createdUser.companyId,
			role: createdUser.roleName,
		};

		try {
			await this.userRepository.createUser(newUser);
			return {
				status: 201,
				message: "Usuário adicionado ao servidor com sucesso.",
			};
		} catch (error: any) {
			return {
				status: 500,
				message: error.message,
			};
		}
	}
}

export { CreateUserUseCase };
