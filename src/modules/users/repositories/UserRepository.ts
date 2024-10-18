import { Permission, User } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { ICreateUserDTO, IUpdateUserDTO, IUserRepository } from "./interfaces/IUserRepository";

class UserRepository implements IUserRepository {
	async createUser(createdUser: ICreateUserDTO): Promise<void> {
		try {
			await prismaClient.user.create({
				data: {
					slugId: createdUser.slugId,
					name: createdUser.name,
					email: createdUser.email,
					passwordHash: createdUser.passwordHash,
					role: {
						connect: {
							name: createdUser.role,
						},
					},
					company: {
						connect: {
							id: createdUser.companyId,
						},
					},
				},
			});
		} catch (error) {
			throw new Error("Erro ao criar usuário no servidor.", error);
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

	async deleteUser(userEmail: string): Promise<void> {
		try {
			await prismaClient.user.delete({
				where: {
					email: userEmail,
				},
			});
		} catch (error) {
			throw new Error("Erro ao deletar usuário no servidor", error);
		}
	}

	async findByEmail(email: string): Promise<User | undefined> {
		try {
			const userByEmail = await prismaClient.user.findUnique({
				where: {
					email,
				},
			});

			return userByEmail;
		} catch (error) {
			throw new Error("Usuário não encontrado.");
		}
	}

	async findPermission(userRole: string): Promise<Permission[]> {
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
			throw new Error("Erro ao buscar permissões do usuário no servidor.", error);
		}
	}

	async findById(id: string): Promise<User> {
		try {
			const userById = await prismaClient.user.findUnique({
				where: {
					id,
				},
			});
			return userById;
		} catch (error) {
			throw new Error("Usuário não encontrado.", error);
		}
	}

	async findBySlugId(slugId: string): Promise<User> {
		try {
			const userBySlugId = await prismaClient.user.findFirst({
				where: {
					slugId,
				},
			});
			return userBySlugId;
		} catch (error) {
			throw new Error("Usuário não encontrado");
		}
	}
}

export { UserRepository };
