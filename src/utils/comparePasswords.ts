import bcrypt from "bcrypt";

async function comparePasswords(a: string, b: string): Promise<boolean> {
	const passwordMatch = await bcrypt.compare(a, b);

	if (!passwordMatch) {
		return false;
	}

	return true;
}

export { comparePasswords };
