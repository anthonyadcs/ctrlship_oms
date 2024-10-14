import UserRepository from "@modules/users/repositories/UserRepository";
import bcrypt from "bcrypt";

class UpdateUserUseCase {
	async execute({ email, password, newEmail, newPassword, newName }) {
		const userExists = await UserRepository.findByEmail({ email });
		const isPasswordCorrect = await bcrypt.compare(password, userExists.passwordHash);

		const userEmail = email;

		if (!userExists || !isPasswordCorrect) {
			return {
				status: 404,
				message: "Email ou senha incorretas.",
			};
		}

		if (newEmail === undefined && newName === undefined && newPassword === undefined) {
			return {
				status: 422,
				message: "É preciso fornecer ao menos um campo que deve ser atualizado.",
			};
		}

		if (newEmail !== undefined) {
			try {
				await UserRepository.updateUser(
					{ userEmail },
					{
						toUpdate: {
							email: newEmail,
						},
					},
				);
			} catch (error) {
				return {
					status: 500,
					message: "Ocorreu um erro ao atualizar o email.",
					errorMessage: error.message,
				};
			}
		}

		if (newPassword !== undefined) {
			try {
				const passwordHash = await bcrypt.hash(newPassword, 10);

				await UserRepository.updateUser(
					{ userEmail },
					{
						toUpdate: {
							passwordHash,
						},
					},
				);
			} catch (error) {
				return {
					status: 500,
					message: "Ocorreu um erro ao atualizar a senha.",
					errorMessage: error.message,
				};
			}
		}

		if (newName !== undefined) {
			try {
				await UserRepository.updateUser(
					{ userEmail },
					{
						toUpdate: {
							name: newName,
						},
					},
				);
			} catch (error) {
				return {
					status: 500,
					message: "Ocorreu um erro ao atualizar o nome do usuário.",
					errorMessage: error.message,
				};
			}
		}

		return {
			status: 200,
			message: "Dados alterados com sucesso!",
		};
	}
}

export { UpdateUserUseCase };
