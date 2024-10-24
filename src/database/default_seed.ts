import { createSlugId } from "@utils/createSlugId";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { prismaClient } from "./prismaClient";

dotenv.config();

const companys = [
	{
		name: "Demonstration Company LTDA.",
	},
];

const seedUsers = [
	{
		name: "General Admin",
		slugId: createSlugId("general_admin@demo_demonstration", 8),
		email: "generaladmin@demo.com",
		password: process.env.ADMIN_PASSWORD,
		role: "general_admin",
		company: "Demonstration Company LTDA.",
	},
	{
		name: "Logistic Operator",
		slugId: createSlugId("logistic_operator@demo_demonstration", 8),
		email: "logisticoperator@demo.com",
		password: "logistic@demo",
		role: "logistic_operator",
		company: "Demonstration Company LTDA.",
	},
	{
		name: "Stock Inspector",
		slugId: createSlugId("stock_inspector_@demo_demonstration", 8),
		email: "stockinspector@demo.com",
		password: "stock@demo",
		role: "stock_inspector",
		company: "Demonstration Company LTDA.",
	},
	{
		name: "Delivery Driver",
		slugId: createSlugId("delivery_driver@demo_demonstration", 8),
		email: "deliverydriver@demo.com",
		password: "delivery@demo",
		role: "delivery_driver",
		company: "Demonstration Company LTDA.",
	},
	{
		name: "Company Admin",
		slugId: createSlugId("company_admin@demo_demonstration", 8),
		email: "companyadmin@demo.com",
		password: "company@demo",
		role: "company_admin",
		company: "Demonstration Company LTDA.",
	},
];

const roles = [
	"general_admin",
	"company_admin",
	"stock_inspector",
	"logistic_operator",
	"delivery_driver",
];

const permissions = [
	{
		name: "create_user_general_admin",
		description: "Allows general admin to create users",
	},
	{
		name: "update_user_general_admin",
		description: "Allows general admin to update users",
	},
	{
		name: "delete_user_general_admin",
		description: "Allows general admin to delete users",
	},
	{
		name: "create_order_general_admin",
		description: "Allows general admin to create orders",
	},
	{
		name: "update_order_general_admin",
		description: "Allows general admin to update orders",
	},
	{
		name: "delete_order_general_admin",
		description: "Allows general admin to delete orders",
	},
	{
		name: "create_user_company_admin",
		description: "Allows company admin to create attributed users",
	},
	{
		name: "update_user_company_admin",
		description: "Allows company admin to update attributed users",
	},
	{
		name: "delete_user_company_admin",
		description: "Allows company admin to delete attributed users",
	},
	{
		name: "create_order_company_admin",
		description: "Allows company admin to create orders",
	},
	{
		name: "update_order_company_admin",
		description: "Allows company admin to update orders",
	},
	{
		name: "delete_order_company_admin",
		description: "Allows company admin to delete order status",
	},
	{
		name: "update_order_status",
		description: "Allows to update order status",
	},
	{
		name: "create_delivery_order",
		description: "Allows to create delivery order",
	},
	{
		name: "delivery_order",
		description: "Allows to delivery orders",
	},
];

async function createSeed() {
	for (const role of roles) {
		const roleExists = await prismaClient.role.findFirst({
			where: { name: role },
		});

		if (!roleExists) {
			await prismaClient.role.create({
				data: {
					name: role,
				},
			});
		}
	}

	// Criação de permissões
	for (const permission of permissions) {
		const permissionExists = await prismaClient.permission.findFirst({
			where: { name: permission.name },
		});

		if (!permissionExists) {
			await prismaClient.permission.create({
				data: {
					name: permission.name,
					description: permission.description,
				},
			});
		}
	}

	// Conexão de permissões aos roles
	for (const role of roles) {
		const existingRole = await prismaClient.role.findFirst({
			where: { name: role },
		});

		if (existingRole) {
			if (role === "general_admin") {
				await prismaClient.role.update({
					where: { name: role },
					data: {
						permission: {
							connect: [
								{ name: "create_user_general_admin" },
								{ name: "update_user_general_admin" },
								{ name: "delete_user_general_admin" },
								{ name: "create_order_general_admin" },
								{ name: "update_order_general_admin" },
								{ name: "delete_order_general_admin" },
							],
						},
					},
				});
			}

			if (role === "company_admin") {
				await prismaClient.role.update({
					where: { name: role },
					data: {
						permission: {
							connect: [
								{ name: "create_user_company_admin" },
								{ name: "update_user_company_admin" },
								{ name: "delete_user_company_admin" },
								{ name: "create_order_company_admin" },
								{ name: "update_order_company_admin" },
								{ name: "delete_order_company_admin" },
							],
						},
					},
				});
			}

			if (
				role === "stock_inspector" ||
				role === "logistic_operator" ||
				role === "delivery_driver"
			) {
				await prismaClient.role.update({
					where: { name: role },
					data: {
						permission: {
							connect: [{ name: "update_order_status" }],
						},
					},
				});
			}

			if (role === "logistic_operator") {
				await prismaClient.role.update({
					where: { name: role },
					data: {
						permission: {
							connect: [{ name: "create_delivery_order" }],
						},
					},
				});
			}

			if (role === "delivery_driver") {
				await prismaClient.role.update({
					where: { name: role },
					data: {
						permission: {
							connect: [{ name: "delivery_order" }],
						},
					},
				});
			}
		}
	}

	for (const company of companys) {
		const companyExists = await prismaClient.company.findFirst({
			where: { name: company.name },
		});

		if (!companyExists) {
			await prismaClient.company.create({
				data: company,
			});
		}
	}

	// Criação de usuários
	for (const seedUser of seedUsers) {
		const passwordHash = await bcrypt.hash(seedUser.password, 10);
		const slugId = createSlugId(passwordHash, 8);

		const userExists = await prismaClient.user.findUnique({
			where: { email: seedUser.email },
		});

		if (!userExists) {
			await prismaClient.user.create({
				data: {
					slugId,
					name: seedUser.name,
					email: seedUser.email,
					passwordHash: passwordHash,
					role: {
						connect: {
							name: seedUser.role,
						},
					},
					company: {
						connect: {
							name: seedUser.company,
						},
					},
				},
			});
		}
	}

	// await prismaClient.user.deleteMany({});
	// await prismaClient.company.deleteMany({});
	// await prismaClient.permission.deleteMany({});
	// await prismaClient.order.deleteMany({});
	// await prismaClient.role.deleteMany({});
}

createSeed();
