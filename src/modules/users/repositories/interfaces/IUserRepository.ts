import { Permission, User } from "@prisma/client";

interface ICreateUserDTO {
	slugId: string;
	name: string;
	email: string;
	passwordHash: string;
	role: string;
	companyId: string;
}

interface IUpdateUserDTO {
	toUpdate: {
		name?: string;
		email?: string;
		passwordHash?: string;
	};
}

interface IUserRepository {
	createUser(createdUser: ICreateUserDTO): Promise<void>;
	updateUser(userEmail: string, { toUpdate }: Partial<IUpdateUserDTO>): Promise<void>;
	deleteUser(userEmail: string): Promise<void>;
	findByEmail(email: string): Promise<User>;
	findPermission(userRole: string): Promise<Permission[]>;
	findById(id: string): Promise<User>;
	findBySlugId(slugId: string): Promise<User>;
}

export type { IUserRepository, ICreateUserDTO, IUpdateUserDTO };
