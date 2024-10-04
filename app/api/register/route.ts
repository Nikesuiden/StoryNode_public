import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST メソッド用のエクスポート
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    // Prisma で既存のメールアドレスを確認
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      // メールアドレスが既に存在する場合
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
      // メールアドレスが存在しない場合
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error) {
    // エラーハンドリング
    return NextResponse.json({ error: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}
