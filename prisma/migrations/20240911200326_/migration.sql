/*
  Warnings:

  - You are about to drop the column `priod` on the `ChatHistory` table. All the data in the column will be lost.
  - Added the required column `period` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatHistory" DROP COLUMN "priod",
ADD COLUMN     "period" TEXT NOT NULL;
