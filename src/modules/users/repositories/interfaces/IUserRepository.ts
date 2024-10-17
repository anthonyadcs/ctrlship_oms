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
	deleteUser(userEmail: string): Promise<void>;
	findByEmail(email: string): Promise<User | undefined>;
	findPermission(userRole: string): Promise<Permission[]>;
}

export type { IUserRepository, ICreateUserDTO, IUpdateUserDTO };
