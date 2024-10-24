import { CompanyRepository } from "@modules/companies/repositories/index";

class GetAllCompaniesUseCase {
	constructor(private companyRepository: CompanyRepository) {}

	async execute() {
		try {
			const companies = await this.companyRepository.findAll();

			if (!companies) {
				return {
					status: 404,
					message: "Nenhuma empresa encontrada.",
				};
			}

			return {
				status: 200,
				data: companies,
			};
		} catch (error: any) {
			return {
				status: 500,
				error: error.message,
			};
		}
	}
}

export { GetAllCompaniesUseCase };
