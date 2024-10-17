import crypto from "node:crypto";

function createSlugId(toHash: string): string {
	return crypto.createHash("md5").update(toHash).digest("hex").slice(0, 8);
}

export { createSlugId };
