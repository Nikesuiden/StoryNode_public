import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // クエリパラメータから 'period' を取得
    const { searchParams } = new URL(req.url);
    const periodParam = searchParams.get('period');

    let createdAtFilter = undefined;

    if (periodParam) {
      const periodDays = parseInt(periodParam, 10);
      if (isNaN(periodDays) || periodDays < 0) {
        return NextResponse.json({ error: "Invalid period parameter" }, { status: 400 });
      }

      // 現在の日付から 'periodDays' 日前の対象日を取得
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - periodDays);

      // 対象日の開始時刻と終了時刻を設定
      const fromDate = new Date(targetDate);
      fromDate.setHours(0, 0, 0, 0);

      const toDate = new Date(targetDate);
      toDate.setHours(23, 59, 59, 999);

      createdAtFilter = {
        gte: fromDate,
        lte: toDate,
      };
    }

    // 日記投稿を取得
    const diaryPosts = await prisma.diaryPost.findMany({
      where: {
        userId: user.id,
        ...(createdAtFilter && { createdAt: createdAtFilter }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(diaryPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching diary posts:", error);
    return NextResponse.json(
      { error: "Error fetching diary posts" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, emotion } = await req.json();

    if (!content || !emotion) {
      return NextResponse.json(
        { error: "Content and emotion are required" },
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
    console.error("日記作成中にエラーが出ました:", error);
    return NextResponse.json(
      { error: "日記作成中にエラーが出ました" },
      { status: 500 }
    );
  }
}
