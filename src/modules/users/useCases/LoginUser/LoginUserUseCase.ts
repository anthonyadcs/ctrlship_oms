import { UserRepository } from "@modules/users/repositories/UserRepository";
import { User } from "@prisma/client";
import { comparePasswords } from "@utils/comparePasswords";
import jwt from "jsonwebtoken";

interface IRequest {
	userToLogin: {
		companyId: string;
		email: string;
		password: string;
	};
}

class LoginUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute({ userToLogin }: IRequest) {
		let user: User;

		try {
			user = await this.userRepository.findByEmail(userToLogin.email);

			if (!user) {
				throw new Error("Email ou senha incorretos.");
			}

			const passwordMatch = await comparePasswords(userToLogin.password, user.passwordHash);

			if (!passwordMatch) {
				throw new Error("Email ou senha incorretos.");
			}
		} catch (error: any) {
			return {
				status: 403,
				message: error.message,
			};
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_PASSWORD, { expiresIn: "8h" });

		const { passwordHash: _, ...userLogin } = user;

		return {
			status: 200,
			message: "Login realizado com sucesso",
			data: {
				userLogin,
				token,
			},
		};
	}
}

export { LoginUserUseCase };
