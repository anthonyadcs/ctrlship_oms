import { UserRepository } from "@modules/users/repositories/UserRepository";
import { IUpdateUserDTO } from "@modules/users/repositories/interfaces/IUserRepository";
import { User } from "@prisma/client";
import { comparePasswords } from "@utils/comparePasswords";
import bcrypt from "bcrypt";

interface IRequest {
	updaterUser: {
		id: string;
		email: string;
		password: string;
	};

	updatedUser: {
		id: string;
		name?: string;
		email?: string;
		password?: string;
	};
}

class UpdateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute({ updatedUser, updaterUser }: IRequest) {
		let updaterUserData: User;

		try {
			const updatedUserExists = await this.userRepository.findById(updatedUser.id);

			if (!updatedUserExists) {
				throw new Error("O usuário a ser atualizado não foi encontrado no servidor.");
			}

			const updaterUserExists = await this.userRepository.findByEmail(updaterUser.email);

			if (updaterUserExists) {
				updaterUserData = updaterUserExists;
			} else {
				throw new Error("O usuário administrador desta operação não foi encontrado no servidor.");
			}
		} catch (error: any) {
			return {
				status: 409,
				message: error.message,
			};
		}

		try {
			const permissions = await this.userRepository.findPermission(updaterUserData.roleName);

			const neededPermissions = permissions.some(
				(permission) =>
					permission.name === "delete_user_general_admin" ||
					permission.name === "delete_user_company_admin",
			);

			if (!neededPermissions) {
				return {
					status: 403,
					message:
						"O usuário administrador não possui as permissões necessárias no servidor para finalizar esta ação.",
				};
			}

			const emailMatch = updaterUser.email === updaterUserData.email;
			const passwordMatch = await comparePasswords(
				updaterUser.password,
				updaterUserData.passwordHash,
			);

			if (!(emailMatch || !passwordMatch)) {
				return {
					status: 401,
					message: "Email ou senha  do usuário administrador incorretos.",
				};
			}
		} catch (error: any) {
			return {
				status: 500,
				message: error.message,
			};
		}

		const toUpdate: IUpdateUserDTO = {
			...(updatedUser.name ? { name: updatedUser.name } : {}),
			...(updatedUser.email ? { email: updatedUser.email } : {}),
			...(updatedUser.password
				? { passwordHash: await bcrypt.hash(updatedUser.password, 10) }
				: {}),
		};

		try {
			await this.userRepository.updateUser(updatedUser.id, toUpdate);

			return {
				status: 200,
				message: "Usuário atualizado no servidor. com sucesso.",
			};
		} catch (error: any) {
			return {
				status: 500,
				message: error.message,
			};
		}
	}
}

export { UpdateUserUseCase };
