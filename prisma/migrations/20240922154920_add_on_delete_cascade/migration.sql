-- DropForeignKey
ALTER TABLE "ChatHistory" DROP CONSTRAINT "ChatHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "DiaryPost" DROP CONSTRAINT "DiaryPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_userId_fkey";

-- AddForeignKey
ALTER TABLE "DiaryPost" ADD CONSTRAINT "DiaryPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatHistory" ADD CONSTRAINT "ChatHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
