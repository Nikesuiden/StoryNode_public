// app/api/diaryPost/[id]/route.ts

import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PUTリクエスト: 日記投稿を更新
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const { content, emotion } = await req.json();

    if (!content || !emotion) {
      return NextResponse.json(
        { error: 'Content and emotion are required' },
        { status: 400 }
      );
    }

    // 対象の日記がユーザーに属しているか確認
    const existingPost = await prisma.diaryPost.findUnique({
      where: { id: id },
    });

    if (!existingPost || existingPost.userId !== user.id) {
      return NextResponse.json(
        { error: 'Diary post not found or not authorized' },
        { status: 404 }
      );
    }

    const updatedDiaryPost = await prisma.diaryPost.update({
      where: { id: id },
      data: { content, emotion },
    });

    return NextResponse.json(updatedDiaryPost, { status: 200 });
  } catch (error) {
    console.error('Error updating diary post:', error);
    return NextResponse.json(
      { error: 'Error updating diary post' },
      { status: 500 }
    );
  }
}

/**
 * DELETEリクエスト: 日記投稿を削除
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const postId = Number(params.id);
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // 削除する日記が存在し、ユーザーに属しているか確認
    const post = await prisma.diaryPost.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== user.id) {
      return NextResponse.json(
        { error: 'Diary post not found or not authorized' },
        { status: 404 }
      );
    }

    // 日記エントリを削除
    await prisma.diaryPost.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { message: 'Diary post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting diary post:', error);
    return NextResponse.json(
      { error: 'Error deleting diary post' },
      { status: 500 }
    );
  }
}
