/*
  Warnings:

  - You are about to drop the column `chatId` on the `ToDo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_chatId_fkey";

-- AlterTable
ALTER TABLE "ToDo" DROP COLUMN "chatId";
