import express from "express";
import { Request, Response } from "express";
import { z } from "zod";
import { CreateUserUseCase } from "./CreateUserUseCase";

const createrUserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	password: z.string().min(6).max(128),
});

const createdUserSchema = z.object({
	name: z.string().min(3).max(30),
	email: z.string().email(),
	password: z.string().min(6).max(128),
	roleName: z.string(),
	companyId: z.string(),
});

class CreateUserController {
	constructor(private createUserUseCase: CreateUserUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const { createrUser, createdUser } = request.body;
		try {
			createrUserSchema.parse(createrUser);
			createdUserSchema.parse(createdUser);
		} catch (e) {
			return response.status(422).json({
				message: "Parâmetros incorretos. Por favor, tente novamente mais tarde",
				e,
			});
		}

		const createUser = await this.createUserUseCase.execute({ createrUser, createdUser });

		return response.status(createUser.status).json(createUser);
	}
}

export { CreateUserController };
