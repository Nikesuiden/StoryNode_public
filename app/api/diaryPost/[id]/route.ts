// app/api/diaryPost/[id]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

/**
 * ユーザーの存在確認と作成を行う関数
 * @param userId ユーザーID
 * @param email ユーザーのメールアドレス
 * @returns 存在するユーザーまたは新規作成されたユーザー
 */

async function findOrCreateUser(userId: string, email?: string) {
  let user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    if (!email) {
      throw new Error('User email is missing');
    }
    user = await prisma.user.create({
      data: {
        id: userId,
        email: email,
      },
    });
  }

  return user;
}

/**
 * PUTリクエスト: 日記投稿を更新
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ユーザーの存在確認と必要なら作成
    let existingUser;
    try {
      existingUser = await findOrCreateUser(data.user.id, data.user.email);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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

    if (!existingPost || existingPost.userId !== existingUser.id) {
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ユーザーの存在確認と必要なら作成
    let existingUser;
    try {
      existingUser = await findOrCreateUser(data.user.id, data.user.email);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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

    if (!post || post.userId !== existingUser.id) {
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
