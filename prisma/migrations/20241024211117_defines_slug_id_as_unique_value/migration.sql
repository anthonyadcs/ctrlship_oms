/*
  Warnings:

  - A unique constraint covering the columns `[slugId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_slugId_key" ON "users"("slugId");
