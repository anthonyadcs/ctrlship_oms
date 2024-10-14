import { User } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { ICreateUserDTO, IUserRepository } from "./interfaces/IUserRepository";

class UserRepository implements IUserRepository {
	async createUser({ name, email, passwordHash, roleName }: ICreateUserDTO): Promise<void> {
		try {
			await prismaClient.user.create({
				data: {
					name,
					email,
					passwordHash,
					roleName,
				},
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	async findByEmail({ email }): Promise<User | null> {
		try {
			const userByEmail = await prismaClient.user.findUniqueOrThrow({
				where: {
					email,
				},
			});

			return userByEmail;
		} catch (e) {
			return;
		}
	}
}

export default new UserRepository();
