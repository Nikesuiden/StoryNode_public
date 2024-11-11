// app/api/diaryPost/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * PUTリクエスト: 日記投稿を更新
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "IDの形式が正しくありません。" }, // パラメータから不正なIdを受信した場合エラーを返す。
        { status: 400 }
      );
    }

    const { content, emotion } = await req.json();

    if (!content || !emotion) {
      return NextResponse.json(
        { error: "Content と emotion が必要です。" },
        { status: 400 }
      );
    }

    // 対象の日記がユーザーに属しているか確認
    const existingPost = await prisma.diaryPost.findUnique({
      where: { id: id },
    });

    if (!existingPost || existingPost.userId !== data.user.id) {
      return NextResponse.json(
        { error: "Diary postまたはユーザーが見つかりません。" },
        { status: 404 }
      );
    }

    const updatedDiaryPost = await prisma.diaryPost.update({
      where: { id: id },
      data: { content, emotion },
    });

    return NextResponse.json(updatedDiaryPost, { status: 200 });
  } catch (error) {
    console.error("diary post更新に失敗しました:", error);
    return NextResponse.json(
      { error: "diary post更新に失敗しました。" },
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
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = Number(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "IDの形式が正しくありません。" }, { status: 400 });
    }

    // 削除する日記が存在し、ユーザーに属しているか確認
    const post = await prisma.diaryPost.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== data.user.id) {
      return NextResponse.json(
        { error: "Diary postまたはユーザーデータがありません。" },
        { status: 404 }
      );
    }

    // 日記エントリを削除
    await prisma.diaryPost.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { message: "Diary postは削除されました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("diary postの削除に失敗しました。:", error);
    return NextResponse.json(
      { error: "diary postの削除に失敗しました。" },
      { status: 500 }
    );
  }
}
