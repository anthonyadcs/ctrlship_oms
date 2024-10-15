import { User } from "@prisma/client";

interface ICreateUserDTO {
	name: string;
	email: string;
	passwordHash: string;
	roleName: string;
}

type IUpdateUserDTO = {
	toUpdate: {
		name?: string;
		email?: string;
		passwordHash?: string;
	};
};

interface IUserRepository {
	createUser({ name, email, passwordHash, roleName }: ICreateUserDTO): Promise<void>;
	updateUser(userEmail: string, toUpdate: Partial<IUpdateUserDTO>);
	findByEmail(email): Promise<User | null>;
	findPermission(userRole);
}

export { IUserRepository, ICreateUserDTO, IUpdateUserDTO };
