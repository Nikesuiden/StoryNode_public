import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { findOrCreateUser } from "@/utils/prisma/findOrCreateUser";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  try {
    // 非同期処理でユーザー情報を取得
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 認証成功後、データベースにユーザーを作成 この処理は完了しないと先に進めないようにする(await)
    await findOrCreateUser(data.user.id, data.user.email as string) // ユーザーを確認後, データベースにユーザーを追加する処理を実行

    // クエリパラメータから 'period' を取得
    const { searchParams } = new URL(req.url);
    const periodParam = searchParams.get("period");

    let createdAtFilter = undefined;

    if (periodParam) {
      const periodDays = parseInt(periodParam, 10);
      if (isNaN(periodDays) || periodDays < 0) {
        return NextResponse.json({ error: "日記収集期間が設定されていません。" }, { status: 400 });
      }

      // 現在の日時から period 日前までの範囲を計算
      const now = new Date();
      const fromDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

      createdAtFilter = {
        gte: fromDate,
        lte: now,
      };
    }

    // 日記投稿を取得
    const diaryPosts = await prisma.diaryPost.findMany({
      where: {
        userId: data.user.id, // ユーザの日記を取得
        // createdAtFilterが存在する場合のみ、createdAtフィルタを適用、その他は無条件で取得
        ...(createdAtFilter && { createdAt: createdAtFilter }),
      },
      orderBy: { createdAt: "desc" }, // 作成日から降順
    });

    return NextResponse.json(diaryPosts, { status: 200 });
  } catch (error) {
    console.error("diary postsの取得に失敗しました。:", error);
    return NextResponse.json(
      { error: "diary postsの取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, emotion } = await req.json();

    if (!content || !emotion) {
      return NextResponse.json(
        { error: "Content と emotion が必要です。" },
        { status: 400 }
      );
    }

    // 新しい日記投稿を作成
    const newDiaryPost = await prisma.diaryPost.create({
      data: {
        content,
        emotion,
        userId: data.user.id
      },
    });

    return NextResponse.json(newDiaryPost, { status: 201 });
  } catch (error) {
    console.error("日記作成中にエラーが出ました:", error);
    return NextResponse.json(
      { error: "日記作成中にエラーが出ました" },
      { status: 500 }
    );
  }
}
