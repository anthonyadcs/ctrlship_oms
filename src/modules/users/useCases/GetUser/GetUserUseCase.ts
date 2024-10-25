import { UserRepository } from "@modules/users/repositories/UserRepository";
import { User } from "@prisma/client";

class GetUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(searchMethod, searchValue) {
		let userData: User;

		try {
			switch (searchMethod) {
				case "slugId":
					userData = await this.userRepository.findBySlugId(searchValue);
					break;
				case "id":
					userData = await this.userRepository.findById(searchValue);
					break;
				case "email":
					userData = await this.userRepository.findByEmail(searchValue);
					break;
				default:
					break;
			}
		} catch (error: any) {
			return {
				status: 500,
				message: error.message,
			};
		}

		if (!userData) {
			return {
				status: 404,
				message: "Usuário não encontrado no servidor.",
			};
		}

		const { passwordHash: _, ...user } = userData;

		return {
			status: 200,
			message: "Usuário encontrado no servidor.",
			data: {
				user,
			},
		};
	}
}

export { GetUserUseCase };
