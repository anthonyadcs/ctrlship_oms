/*
  Warnings:

  - Added the required column `slugId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slugId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "roleName" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    CONSTRAINT "users_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "roles" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("companyId", "createdAt", "email", "id", "name", "passwordHash", "roleName", "updatedAt") SELECT "companyId", "createdAt", "email", "id", "name", "passwordHash", "roleName", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
