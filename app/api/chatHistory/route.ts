import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { findOrCreateUser } from "@/utils/prisma/findOrCreateUser";

// GETリクエスト用のハンドラ
export async function GET(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  const supabase = await createServerSupabaseClient();
  try {
    // ユーザ認証の箇所　// ここsupabaseからデータを取得
    const { data, error } = await supabase.auth.getUser();

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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      { error: "Error fetching chat history" },
      { status: 500 }
    );
  }
}

// POSTリクエスト用のハンドラをエクスポート
export async function POST(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const UserId = data.user.id;
    const Email = data.user.email as string;

    // ユーザーの存在確認と作成
    try {
      await findOrCreateUser(UserId, Email);
    } catch (err) {
      console.error("ユーザー作成エラー:", err);
      return NextResponse.json(
        { error: "User creation failed" },
        { status: 500 }
      );
    }

    const { prompt, response, period } = await req.json();

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: {
        id: data.user.id,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    console.error("Error saving chat history:", error);
    return NextResponse.json(
      { error: "Error saving chat history" },
      { status: 500 }
    );
  }
}
