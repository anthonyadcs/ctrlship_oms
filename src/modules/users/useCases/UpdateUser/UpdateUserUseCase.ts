import UserRepository from "@modules/users/repositories/UserRepository";
import { comparePasswords } from "@utils/comparePasswords";
import bcrypt from "bcrypt";

interface IRequest {
	updaterUser: {
		email: string;
		password: string;
	};

	updatedUser: {
		currentEmail: string;
		name?: string;
		email?: string;
		passwordHash?: string;
	};
}

class UpdateUserUseCase {
	async execute({ updatedUser, updaterUser }: IRequest) {
		const updatedUserExists = await UserRepository.findByEmail(updatedUser.currentEmail);

		const updaterUserExists = await UserRepository.findByEmail(updaterUser.email);

		//Valida se o usuário atualizador e o usuário atualizado existem
		if (updaterUserExists && updatedUserExists) {
			//Verifica se o usuário tem permissão para atualizar usuários
			const permissions = await UserRepository.findPermission(updaterUserExists.roleName);

			const permission = permissions.find((permission) => {
				return permission.name === "update_user_admin" || permission.name === "update_user_company";
			});

			if (
				permission === undefined ||
				(permission.name === "update_user_company" && updatedUserExists.roleName === "admin")
			) {
				return {
					status: 403,
					message: "Você não possui permissão para atualizar usuários.",
				};
			}
		} else {
			return {
				status: 404,
				message: "Usuário a atualizar ou usuário atualizador não encontrados",
			};
		}

		//Verifica se a senha do usuário atualizador é correta
		if (!comparePasswords(updaterUser.password, updaterUserExists.passwordHash)) {
			return {
				status: 401,
				message: "Email ou senha  do usuário atualizador incorretos.",
			};
		}

		// Gera o hash de acordo com a nova senha fornecida
		const newPasswordHash = await bcrypt.hash(updatedUser.passwordHash, 10);

		updatedUser.passwordHash = newPasswordHash;

		// Valida se os dados de atualização são válidos e realiza a solicitação para o banco de dados
		for (const [key, value] of Object.entries(updatedUser)) {
			try {
				if (!value) {
					throw new Error("Pelo menos um campo de atualização deve ser fornecido.");
				}

				if (key !== "currentEmail") {
					await UserRepository.updateUser(updatedUser.currentEmail, {
						toUpdate: {
							[key]: value,
						},
					});
				} else {
					continue;
				}
				return {
					status: 201,
					message: "Dados alterados com sucesso",
				};
			} catch (error) {
				return {
					status: 500,
					message: error,
				};
			}
		}
	}
}

export { UpdateUserUseCase };
