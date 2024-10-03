import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GETリクエスト: 日記投稿の一覧を取得
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 日記投稿を取得
    const diaryPosts = await prisma.diaryPost.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(diaryPosts, { status: 200 });
  } catch (error) {
    console.error('Error fetching diary posts:', error);
    return NextResponse.json(
      { error: 'Error fetching diary posts' },
      { status: 500 }
    );
  }
}

/**
 * POSTリクエスト: 新しい日記投稿を作成
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, emotion } = await req.json();

    if (!content || !emotion) {
      return NextResponse.json(
        { error: 'Content and emotion are required' },
        { status: 400 }
      );
    }

    // 新しい日記投稿を作成
    const newDiaryPost = await prisma.diaryPost.create({
      data: {
        content,
        emotion,
        userId: user.id,
      },
    });

    return NextResponse.json(newDiaryPost, { status: 201 });
  } catch (error) {
    console.error('日記作成中にエラーが出ました:', error);
    return NextResponse.json(
      { error: '日記作成中にエラーが出ました' },
      { status: 500 }
    );
  }
}
