import UserRepository from "@modules/users/repositories/UserRepository";
import { User } from "@prisma/client";
import { comparePasswords } from "@utils/comparePasswords";

interface IRequest {
	deletingUser: {
		email: string;
		password: string;
	};

	deletedUsers: {
		emails: string[];
	};
}

class DeleteUserUseCase {
	async execute({ deletingUser, deletedUsers }: IRequest) {
		let deletingUserData: User;

		try {
			for (const deletedUser of deletedUsers.emails) {
				const userData = await UserRepository.findByEmail(deletedUser);

				if (!userData) {
					throw new Error(
						"Um ou mais usuários a serem deletados não foram encontrados no servidor.",
					);
				}
			}

			const userData = await UserRepository.findByEmail(deletingUser.email);
			if (userData) {
				deletingUserData = userData;
			} else {
				throw new Error("O usuário administrador desta operação não foi encontrado no servidor.");
			}
		} catch (error) {
			return {
				status: 409,
				message: error.message,
			};
		}

		try {
			const permissions = await UserRepository.findPermission(deletingUserData.roleName);

			const neededPermissions = permissions.some(
				(permission) =>
					permission.name === "delete_user_admin" || permission.name === "delete_user_company",
			);

			const passwordMatch = await comparePasswords(
				deletingUser.password,
				deletingUserData.passwordHash,
			);

			if (!passwordMatch || !neededPermissions) {
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
			for (const deletedUser of deletedUsers.emails) {
				await UserRepository.deleteUser(deletedUser);
			}

			return {
				status: 200,
				message: "Usuário deletado do servidor com sucesso.",
			};
		} catch (error) {
			return {
				status: 500,
				message: error.message,
			};
		}
	}
}

export { DeleteUserUseCase };
