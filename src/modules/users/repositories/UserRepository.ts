import { User } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { ICreateUserDTO, IUpdateUserDTO, IUserRepository } from "./interfaces/IUserRepository";

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

	async updateUser({ userEmail }: string, { toUpdate }: Partial<IUpdateUserDTO>): Promise<void> {
		try {
			const fieldsToUpdate: Partial<IUpdateUserDTO> = {};

			if (toUpdate.email) {
				fieldsToUpdate.email = toUpdate.email;
			}

			if (toUpdate.passwordHash) {
				fieldsToUpdate.passwordHash = toUpdate.passwordHash;
			}

			if (toUpdate.name) {
				fieldsToUpdate.name = toUpdate.name;
			}

			await prismaClient.user.update({
				where: { email: userEmail },
				data: fieldsToUpdate,
			});
		} catch (error) {
			throw new Error(error);
		}
	}
}

export default new UserRepository();
