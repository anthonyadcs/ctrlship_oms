/*
  Warnings:

  - You are about to drop the column `roleName` on the `permissions` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_permissions" ("id", "name") SELECT "id", "name" FROM "permissions";
DROP TABLE "permissions";
ALTER TABLE "new_permissions" RENAME TO "permissions";
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
