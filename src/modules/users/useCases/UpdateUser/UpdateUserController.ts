import UserRepository from "@modules/users/repositories/UserRepository";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

const updateUserSchema = z.object({
	//Informações necessárias para atualizar
	email: z.string().email(),
	password: z.string().min(3).max(128),

	//Novas informações que poderão ser atualizadas
	newEmail: z.string().email().optional(),
	newName: z.string().min(3).max(30).optional(),
	newPassword: z.string().min(6).max(128).optional(),
});

class UpdateUserController {
	constructor(private updateUserUseCase: UpdateUserUseCase) {}

	async handle(request: Request, response: Response) {
		try {
			updateUserSchema.parse(request.body);
		} catch (error) {
			return response.status(422).json({
				message: "Parâmetros incorretos. Por favor, tente novamente mais tarde",
				error: error.issues.map((err) => err.message),
			});
		}

		const { email, password, newName, newPassword, newEmail } = request.body;

		const updateUser = await this.updateUserUseCase.execute({
			email,
			password,
			newName,
			newPassword,
			newEmail,
		});

		return response.status(updateUser.status).json(updateUser);
	}
}

export { UpdateUserController };
