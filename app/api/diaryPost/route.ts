import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// 必要に応じてランタイムを 'nodejs' に設定
export const runtime = 'nodejs';

/**
 * GETリクエスト: 日記投稿の一覧を取得
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 日記投稿を取得
    const diaryPosts = await prisma.diaryPost.findMany({
      where: { userId: existingUser.id },
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

// POSTリクエストの部分も同様に修正
export async function POST(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { content, emotion } = await req.json();

    if (!content || !emotion) {
      return NextResponse.json(
        { error: 'Content and emotion are required' },
        { status: 400 }
      );
    }

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 新しい日記投稿を作成
    const newDiaryPost = await prisma.diaryPost.create({
      data: {
        content,
        emotion,
        userId: existingUser.id,
      },
    });

    return NextResponse.json(newDiaryPost, { status: 201 });
  } catch (error) {
    console.error('Error creating diary post:', error);
    return NextResponse.json(
      { error: 'Error creating diary post' },
      { status: 500 }
    );
  }
}
