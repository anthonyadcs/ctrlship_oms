import { Permission, User } from "@prisma/client";

interface ICreateUserDTO {
	name: string;
	email: string;
	passwordHash: string;
	roleName: string;
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
	findByEmail(email: string): Promise<User | undefined>;
	findPermission(userRole: string): Promise<Permission[] | undefined>;
}

export type { IUserRepository, ICreateUserDTO, IUpdateUserDTO };
