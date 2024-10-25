import cors from "cors";
import express from "express";
import { prismaClient } from "./database/prismaClient";
import { companyRoutes } from "./routes/company.routes";
import { userRoutes } from "./routes/user.routes";

async function startServer() {
	try {
		await prismaClient.$connect();
		console.log("Prisma conectado ao banco de dados");

		const app = express();
		app.use(cors());
		app.use(express.json());
		app.use(userRoutes);
		app.use(companyRoutes);

		app.listen("8080", () => {
			console.log("Listening");
		});

		process.on("SIGINT", async () => {
			await prismaClient.$disconnect();
			console.log("Prisma desconectado do banco de dados");
			process.exit();
		});
	} catch (error) {
		console.error("Falha ao conectar ao banco de dados", error);
		process.exit(1);
	}
}

startServer();
