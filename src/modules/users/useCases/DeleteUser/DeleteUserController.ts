import { Request, Response } from "express";
import { z } from "zod";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

const deletingUserschema = z.object({
	email: z.string().email(),
	password: z.string().min(3).max(128),
});

const deletedUsersSchema = z.object({
	emails: z.array(z.string().email()),
});

class DeleteUserController {
	constructor(private removeUserUseCase: DeleteUserUseCase) {}

	async handle(request: Request, response: Response) {
		const { deletingUser, deletedUsers } = request.body;
		try {
			deletingUserschema.parse(deletingUser);
			deletedUsersSchema.parse(deletedUsers);
		} catch (error) {
			return response.status(422).json({
				message: "Parâmetros incorretos. Por favor, tente novamente mais tarde",
				error: error.issues.map((err) => err.message),
			});
		}

		const deleteUser = await this.removeUserUseCase.execute({ deletingUser, deletedUsers });

		return response.status(deleteUser.status).json(deleteUser);
	}
}

export { DeleteUserController };
