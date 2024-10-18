import crypto from "node:crypto";

function createSlugId(toHash: string, slice: number): string {
	return crypto.createHash("md5").update(toHash).digest("hex").slice(0, slice).toUpperCase();
}

export { createSlugId };
