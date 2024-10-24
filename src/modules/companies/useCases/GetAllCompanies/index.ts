import { companyRepository } from "@modules/companies/repositories/index";
import { GetAllCompaniesController } from "./GetAllCompaniesController";
import { GetAllCompaniesUseCase } from "./GetAllCompaniesUseCase";

const getAllCompaniesUseCase = new GetAllCompaniesUseCase(companyRepository);

const getAllCompaniesController = new GetAllCompaniesController(getAllCompaniesUseCase);

export { getAllCompaniesController };
