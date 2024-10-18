import { Request, Response } from "express";
import { z } from "zod";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

const updatedUserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email().optional(),
	name: z.string().min(3).max(30).optional(),
	password: z.string().min(6).max(128).optional(),
});

const updaterUserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	password: z.string().min(3).max(128),
});

class UpdateUserController {
	constructor(private updateUserUseCase: UpdateUserUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			const { updatedUser, updaterUser } = request.body;
			updatedUserSchema.parse(updatedUser);
			updaterUserSchema.parse(updaterUser);
		} catch (error: any) {
			return response.status(422).json({
				message: "Parâmetros incorretos. Por favor, tente novamente mais tarde",
				error: error.issues.map((err) => err.message),
			});
		}

		const { updatedUser, updaterUser } = request.body;

		const updateUser = await this.updateUserUseCase.execute({ updatedUser, updaterUser });

		return response.status(updateUser.status).json(updateUser);
	}
}

export { UpdateUserController };
