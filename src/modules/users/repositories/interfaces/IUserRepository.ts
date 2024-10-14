import { User } from "@prisma/client";

interface ICreateUserDTO {
	name: string;
	email: string;
	passwordHash: string;
	roleName: string;
}

interface IUserRepository {
	createUser({ name, email, passwordHash, roleName }: ICreateUserDTO): Promise<void>;
	findByEmail({ email }): Promise<User | null>;
}

export { IUserRepository, ICreateUserDTO };
