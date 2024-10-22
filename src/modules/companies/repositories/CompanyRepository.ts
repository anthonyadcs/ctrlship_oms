import { prismaClient } from "@database/prismaClient";
import { Company } from "@prisma/client";
import { ICompanyRepository } from "./interfaces/ICompanyRepository";

class CompanyRepository implements ICompanyRepository {
	async findById(companyId: string): Promise<Company> {
		try {
			const company = await prismaClient.company.findUnique({
				where: { id: companyId },
			});
			return company;
		} catch (error: any) {
			throw new Error("Erro na busca da empresa no servidor.");
		}
	}
}

export { CompanyRepository };
