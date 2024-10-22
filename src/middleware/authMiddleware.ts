import { companyRepository } from "@modules/companies/repositories/index";
import { userRepository } from "@modules/users/repositories/index";
import { Company, User } from "@prisma/client";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

type JwtPayload = {
	id: string;
};

async function authMiddlaware(request: Request, response: Response, next: NextFunction) {
	const { authorization } = request.headers;
	let user: User;
	let userId: string;
	let company: Company;

	if (!authorization) {
		response.status(401).json("Não autorizado.");
	}

	const token = authorization.split(" ")[1];

	try {
		const { id } = jwt.verify(token, process.env.JWT_PASSWORD) as JwtPayload;

		userId = id;
	} catch (error: any) {
		response.status(401).json(error.message);
	}

	try {
		user = await userRepository.findById(userId);

		if (!user) {
			throw new Error("Usuário não encontrado no servidor.");
		}
	} catch (error: any) {
		response.status(403).json({ message: error.message });
	}

	try {
		company = await companyRepository.findById(user.companyId);

		if (!company) {
			throw new Error("Empresa não encontrada no banco de dados.");
		}
	} catch (error: any) {
		response.status(403).json({ message: error.message });
	}

	const { passwordHash: _password, ...userInfo } = user;

	request.session = { company, userInfo };

	next();
}

export { authMiddlaware };
