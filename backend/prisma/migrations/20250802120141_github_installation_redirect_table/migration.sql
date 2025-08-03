/*
  Warnings:

  - You are about to drop the column `accessToken` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `repos` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OAuthAccount" DROP COLUMN "accessToken";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "repos";

-- CreateTable
CREATE TABLE "public"."GitHubInstallationRedirect" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "redirectUrl" TEXT NOT NULL,
    "repositoryFullName" TEXT NOT NULL,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubInstallationRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubInstallationRedirect_userId_repositoryFullName_key" ON "public"."GitHubInstallationRedirect"("userId", "repositoryFullName");

-- AddForeignKey
ALTER TABLE "public"."GitHubInstallationRedirect" ADD CONSTRAINT "GitHubInstallationRedirect_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
