import bcrypt from "bcrypt";
import { prismaClient } from "./prismaClient";

const seedUsers = [
	{ name: "Admin", email: "admin@demo.com", password: "admin@demo", role: "admin" },
	{
		name: "Logistic Operator",
		email: "logoperator@demo.com",
		password: "logistic@demo",
		role: "logistic_operator",
	},
	{
		name: "Stock Operator",
		email: "stockeoperator@demo.com",
		password: "stock@demo",
		role: "stock_inspector",
	},
	{
		name: "Delivery Driver",
		email: "deliverydriver@demo.com",
		password: "delivery@demo",
		role: "delivery_driver",
	},
	{ name: "Company", email: "company@demo.com", password: "company@demo", role: "company" },
];

const roles = ["admin", "company", "stock_inspector", "logistic_operator", "delivery_driver"];

const permissions = [
	{
		name: "create_user_admin",
		description: "Allows admin to create users",
	},
	{
		name: "update_user_admin",
		description: "Allows admin to update users",
	},
	{
		name: "delete_user_admin",
		description: "Allows admin to delete users",
	},
	{
		name: "create_order_admin",
		description: "Allows admin to create orders",
	},
	{
		name: "update_order_admin",
		description: "Allows admin to update orders",
	},
	{
		name: "delete_order_admin",
		description: "Allows admin to delete orders",
	},
	{
		name: "create_user_company",
		description: "Allows company to create attributed users",
	},
	{
		name: "update_user_company",
		description: "Allows company to update attributed users",
	},
	{
		name: "delete_user_company",
		description: "Allows company to delete attributed users",
	},
	{
		name: "create_order",
		description: "Allows company to create orders",
	},
	{
		name: "update_order",
		description: "Allows company to update orders",
	},
	{
		name: "delete_order",
		description: "Allows company to delete order status",
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
	// Criação de roles
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
			if (role === "admin") {
				await prismaClient.role.update({
					where: { name: role },
					data: {
						permission: {
							connect: [
								{ name: "create_user_admin" },
								{ name: "update_user_admin" },
								{ name: "delete_user_admin" },
								{ name: "create_order_admin" },
								{ name: "update_order_admin" },
								{ name: "delete_order_admin" },
							],
						},
					},
				});
			}

			if (role === "company") {
				await prismaClient.role.update({
					where: { name: role },
					data: {
						permission: {
							connect: [
								{ name: "create_user_company" },
								{ name: "update_user_company" },
								{ name: "delete_user_company" },
								{ name: "create_order" },
								{ name: "update_order" },
								{ name: "delete_order" },
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

	// Criação de usuários
	for (const seedUser of seedUsers) {
		const passwordHash = await bcrypt.hash(seedUser.password, 10);

		const userExists = await prismaClient.user.findUnique({
			where: { email: seedUser.email },
		});

		if (!userExists) {
			await prismaClient.user.create({
				data: {
					name: seedUser.name,
					email: seedUser.email,
					passwordHash: passwordHash,
					role: {
						connect: {
							name: seedUser.role,
						},
					},
				},
			});
		}
	}
}

createSeed();
