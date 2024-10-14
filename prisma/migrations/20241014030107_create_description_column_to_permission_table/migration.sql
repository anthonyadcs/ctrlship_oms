/*
  Warnings:

  - Added the required column `description` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_permissions" ("id", "name") SELECT "id", "name" FROM "permissions";
DROP TABLE "permissions";
ALTER TABLE "new_permissions" RENAME TO "permissions";
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
