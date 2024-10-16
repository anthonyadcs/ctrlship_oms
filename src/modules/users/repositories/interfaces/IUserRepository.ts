import { User } from "@prisma/client";

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
	updateUser(userEmail: string, { toUpdate }: Partial<IUpdateUserDTO>);
	findByEmail(email): Promise<User | null>;
	findPermission(userRole);
}

export { IUserRepository, ICreateUserDTO, IUpdateUserDTO };
