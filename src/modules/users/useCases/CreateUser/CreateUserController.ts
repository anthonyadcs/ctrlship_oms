import { Request, Response } from "express";
import { z } from "zod";
import { CreateUserUseCase } from "./CreateUserUseCase";

const createUserSchema = z.object({
	name: z.string().min(3).max(30),
	email: z.string().email(),
	password: z.string().min(6).max(128),
	roleName: z.string(),
});

class CreateUserController {
	constructor(private createUserUseCase: CreateUserUseCase) {}

	async handle(request: Request, response: Response) {
		try {
			createUserSchema.parse(request.body);
		} catch (e) {
			return response.status(422).json({
				message: "Parâmetros incorretos. Por favor, tente novamente mais tarde",
				e,
			});
		}

		const { name, email, password, roleName } = request.body;

		const createUser = await this.createUserUseCase.execute({ name, email, password, roleName });

		return response.status(createUser.status).json(createUser);
	}
}

export { CreateUserController };
