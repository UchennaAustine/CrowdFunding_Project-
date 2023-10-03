/*
  Warnings:

  - You are about to drop the column `education` on the `crowdAbeg` table. All the data in the column will be lost.
  - You are about to drop the column `environment` on the `crowdAbeg` table. All the data in the column will be lost.
  - You are about to drop the column `finance` on the `crowdAbeg` table. All the data in the column will be lost.
  - You are about to drop the column `health` on the `crowdAbeg` table. All the data in the column will be lost.
  - You are about to drop the column `others` on the `crowdAbeg` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "crowdAbeg" DROP COLUMN "education";
ALTER TABLE "crowdAbeg" DROP COLUMN "environment";
ALTER TABLE "crowdAbeg" DROP COLUMN "finance";
ALTER TABLE "crowdAbeg" DROP COLUMN "health";
ALTER TABLE "crowdAbeg" DROP COLUMN "others";
