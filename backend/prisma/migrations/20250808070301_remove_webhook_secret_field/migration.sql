/*
  Warnings:

  - You are about to drop the column `webhookSecret` on the `Repository` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Repository" DROP COLUMN "webhookSecret";
