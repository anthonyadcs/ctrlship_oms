import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { GetSessionDataUseCase } from "./GetSessionDataUseCase";

dotenv.config();

type JwtPayload = {
	id: string;
};

class GetSessionDataController {
	constructor(private getSessionDataUseCase: GetSessionDataUseCase) {}

	handle(request: Request, response: Response) {
		const { authorization } = request.headers;

		if (!authorization) {
			response.status(403).json("Não autorizado.");
		}

		const token = authorization.split(" ")[1];

		const { id }: JwtPayload = jwt.verify(token, process.env.JWT_PASSWORD) as JwtPayload;
	}
}

export { GetSessionDataController };
