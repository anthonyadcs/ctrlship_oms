import { Request, Response } from "express";
import { z } from "zod";
import { LoginUserUseCase } from "./LoginUserUseCase";

class LoginUserController {
	constructor(private loginUserUseCase: LoginUserUseCase) {}

	async handle(request: Request, response: Response) {
		const loginUserSchema = z.object({
			companyId: z.string().uuid(),
			email: z.string().email(),
			password: z.string().min(3).max(128),
		});

		try {
			// loginUserSchema.parse(request.body);
			("Hello");
		} catch (error) {
			return {
				status: 400,
				message: "Hello 2",
			};
		}

		const loginUser = await this.loginUserUseCase.execute({ userToLogin: request.body });

		return response.status(loginUser.status).json(loginUser);
	}
}

export { LoginUserController };
