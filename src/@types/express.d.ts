import { Company, User } from "@prisma/client";

declare global {
	namespace Express {
		export interface Request {
			session: {
				company: Company;
				userInfo: Partial<User>;
			};
		}
	}
}
