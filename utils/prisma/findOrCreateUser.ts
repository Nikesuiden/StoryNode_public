import prisma from '@/lib/prisma';

// データベースにユーザーが存在しない場合、新規作成をする。
export async function findOrCreateUser(userId: string, email: string) {
  let user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        email: email,
      },
    });
  }
}
