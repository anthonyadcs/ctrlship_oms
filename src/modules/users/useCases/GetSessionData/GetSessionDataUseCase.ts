import { UserRepository } from "@modules/users/repositories/UserRepository";

class GetSessionDataUseCase {
	constructor(private userRepository: UserRepository) {}

	execute() {
		return;
	}
}

export { GetSessionDataUseCase };
