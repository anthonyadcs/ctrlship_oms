import { Permission, User } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { ICreateUserDTO, IUpdateUserDTO, IUserRepository } from "./interfaces/IUserRepository";

class UserRepository implements IUserRepository {
	async createUser(createdUser: ICreateUserDTO): Promise<void> {
		try {
			await prismaClient.user.create({
				data: createdUser,
			});
		} catch (error) {
			throw new Error("Erro ao criar usuário no servidor.", error);
		}
	}

	async findByEmail(email: string): Promise<User | undefined> {
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
			throw new Error("Erro ao atualizar usuário no servidor.", error);
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
