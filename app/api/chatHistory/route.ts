import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { findOrCreateUser } from "@/utils/prisma/findOrCreateUser";

// GETリクエスト用のハンドラ
export async function GET(
  req: NextRequest,
) {
  const supabase = await createServerSupabaseClient();
  try {
    // ユーザ認証の箇所　// ここsupabaseからデータを取得
    const { data } = await supabase.auth.getUser();

    // ログイン中のアカウントがない場合
    if (!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // prismaデータベースからUserIdを取得
    // ユーザーの存在確認　これはデータベースのフィルタ用　PrismaのUserIdとSupabaseのIdに互換性を持たせるため
    const existingUser = await prisma.user.findUnique({
      where: {
        id: data.user.id,
      },
    });

    // 存在ユーザーの照合が合わなかった場合
    if (!existingUser) {
      return NextResponse.json({ error: "ユーザーが見つかりません。" }, { status: 404 });
    }

    const chatHistorys = await prisma.chatHistory.findMany({
      where: { userId: existingUser.id }, // ログインユーザーが書いた日記を降順に取得
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(chatHistorys, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "chat history の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POSTリクエスト用のハンドラをエクスポート
export async function POST(
  req: NextRequest,
) {
  const supabase = await createServerSupabaseClient();
  try {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, response, period } = await req.json();

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: {
        id: data.user.id,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "ユーザーが見つかりません。" }, { status: 404 });
    }

    const newChatHistory = await prisma.chatHistory.create({
      data: {
        prompt,
        response,
        period,
        userId: existingUser.id,
      },
    });

    return NextResponse.json(newChatHistory, { status: 201 });
  } catch (error) {
    console.error("chat historyの保存に失敗しました。:", error);
    return NextResponse.json(
      { error: "chat historyの保存に失敗しました。" },
      { status: 500 }
    );
  }
}
