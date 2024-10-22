import { Company } from "@prisma/client";

interface ICompanyRepository {
	findById(companyId: string): Promise<Company>;
}

export type { ICompanyRepository };
