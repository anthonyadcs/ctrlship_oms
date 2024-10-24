import { Router } from "express";
import { getAllCompaniesController } from "../modules/companies/useCases/GetAllCompanies/index";

const companyRoutes = Router();

// @ts-ignore
companyRoutes.get("/company/all", async (request, response) => {
	return await getAllCompaniesController.handle(request, response);
});

export { companyRoutes };
