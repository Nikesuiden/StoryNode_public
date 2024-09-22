// app/api/diaryPost/route.ts

import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GETリクエスト: 認証ユーザーの日記投稿を取得
 */
export async function GET(req: NextRequest) {
  try {
    // 認証ユーザーを取得
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prismaのデータベースでユーザーが存在するか確認
    let existingUser = await prisma.user.findUnique({ where: { id: user.id } });

    // 存在しない場合、新しくユーザーを作成
    if (!existingUser) {
      if (!user.email) {
        return NextResponse.json({ error: 'User email is missing' }, { status: 400 });
      }
      existingUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    // 認証ユーザーの日記投稿のみを取得
    const diaryPosts = await prisma.diaryPost.findMany({
      where: {
        userId: existingUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: { email: true },
        },
      },
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

    // user.emailが存在するか確認
    if (!user.email) {
      return NextResponse.json({ error: 'User email is missing' }, { status: 400 });
    }

    // Prismaのデータベースでユーザーが存在するか確認
    let existingUser = await prisma.user.findUnique({ where: { id: user.id } });

    // 存在しない場合、新しくユーザーを作成
    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    const { content, emotion } = await req.json();

    if (!content || !emotion) {
      return NextResponse.json(
        { error: 'Content and emotion are required' },
        { status: 400 }
      );
    }

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
