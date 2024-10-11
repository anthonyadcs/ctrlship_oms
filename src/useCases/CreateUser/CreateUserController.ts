import { Request, Response } from "express";
import { z } from "zod";

const createUserSchema = z.object({
	name: z.string().min(3).max(30),
	email: z.string().email(),
	password: z.string().min(6).max(128),
	role: z.string(),
});

class CreateUserController {
	async handle(request: Request, response: Response) {
		try {
			createUserSchema.parse(request.body);
		} catch (e) {
			return response.status(422).json({
				message: "Parâmetros incorretos. Por favor, tente novamente mais tarde",
				e,
			});
		}

		return response.status(201).json("Usuário criado com sucesso");
	}
}

export { CreateUserController };
