import { UserRepository } from "@modules/users/repositories/UserRepository";
import { User } from "@prisma/client";
import { comparePasswords } from "@utils/comparePasswords";

interface IRequest {
	deletingUser: {
		id: string;
		email: string;
		password: string;
	};

	deletedUsers: {
		ids: string[];
	};
}

class DeleteUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute({ deletingUser, deletedUsers }: IRequest) {
		let deletingUserData: User;

		try {
			for (const deletedUser of deletedUsers.ids) {
				const userData = await this.userRepository.findById(deletedUser);

				if (!userData) {
					throw new Error(
						"Um ou mais usuários a serem deletados não foram encontrados no servidor.",
					);
				}

				if (userData.roleName === "general_admin") {
					throw new Error("O usuário administrador geral não pode ser deletado do servidor.");
				}
			}

			const userData = await this.userRepository.findById(deletingUser.id);

			if (userData) {
				deletingUserData = userData;
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
			const permissions = await this.userRepository.findPermission(deletingUserData.roleName);

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

			const emailMatch = deletingUser.email === deletingUserData.email;

			const passwordMatch = await comparePasswords(
				deletingUser.password,
				deletingUserData.passwordHash,
			);

			if (!emailMatch || !passwordMatch) {
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

		try {
			for (const deletedUser of deletedUsers.ids) {
				await this.userRepository.deleteUser(deletedUser);
			}

			return {
				status: 200,
				message: "Usuário deletado do servidor com sucesso.",
			};
		} catch (error: any) {
			return {
				status: 500,
				message: error.message,
			};
		}
	}
}

export { DeleteUserUseCase };
