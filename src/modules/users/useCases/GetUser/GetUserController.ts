import { Request, Response } from "express";
import { z } from "zod";
import { GetUserUseCase } from "./GetUserUseCase";

type JwtPayload = {
	id: string;
};

const getUserSchema = z.object({
	searchMethod: z.enum(["id", "slugId", "email"]),
	searchValue: z.string(),
});

class GetUserController {
	constructor(private getUserUseCase: GetUserUseCase) {}

	async handle(request: Request, response: Response) {
		try {
			getUserSchema.parse(request.body);
		} catch (error) {
			return response
				.status(422)
				.json({ message: "Parâmetros incorretos. Por favor, tente novamente mais tarde" });
		}

		const { searchMethod, searchValue } = request.body;

		const user = await this.getUserUseCase.execute(searchMethod, searchValue);

		response.status(user.status).json(user);
	}
}

export { GetUserController };
