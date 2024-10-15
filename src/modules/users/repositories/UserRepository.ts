import { Permission, User } from "@prisma/client";
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

	async findByEmail(email): Promise<User | null> {
		try {
			const userByEmail = await prismaClient.user.findUniqueOrThrow({
				where: {
					email,
				},
			});
			return userByEmail;
		} catch (error) {
			return undefined;
		}
	}

	async updateUser(userEmail: string, { toUpdate }: Partial<IUpdateUserDTO>): Promise<void> {
		try {
			for (const [key, value] of Object.entries(toUpdate)) {
				await prismaClient.user.update({
					where: { email: userEmail },
					data: {
						[key]: value,
					},
				});
			}
		} catch (error) {
			throw new Error("Erro ao atualizar usuário no servidor");
		}
	}

	async findPermission(userRole: string): Promise<Permission[] | undefined> {
		try {
			const permissions = await prismaClient.permission.findMany({
				where: {
					role: {
						some: {
							name: userRole,
						},
					},
				},
			});
			return permissions;
		} catch (error) {
			return undefined;
		}
	}
}

export default new UserRepository();
