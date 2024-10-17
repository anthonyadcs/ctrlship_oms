import bcrypt from "bcrypt";

async function comparePasswords(a: string, b: string): Promise<boolean> {
	return await bcrypt.compare(a, b);
}

export { comparePasswords };
