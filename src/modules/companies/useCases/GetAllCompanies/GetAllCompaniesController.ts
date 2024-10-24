import { Request, Response } from "express";
import { GetAllCompaniesUseCase } from "./GetAllCompaniesUseCase";

class GetAllCompaniesController {
	constructor(private getAllCompaniesUseCase: GetAllCompaniesUseCase) {}

	async handle(request: Request, response: Response) {
		const companies = await this.getAllCompaniesUseCase.execute();

		return response.status(companies.status).json(companies);
	}
}

export { GetAllCompaniesController };
