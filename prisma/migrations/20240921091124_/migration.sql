/*
  Warnings:

  - Added the required column `userId` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `DiaryPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ToDo` table without a default value. This is not possible if the table is not empty.
  - Made the column `chatId` on table `ToDo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_chatId_fkey";

-- AlterTable
ALTER TABLE "ChatHistory" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DiaryPost" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ToDo" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "chatId" SET NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "DiaryPost" ADD CONSTRAINT "DiaryPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatHistory" ADD CONSTRAINT "ChatHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
