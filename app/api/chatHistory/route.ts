import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
import { constrainedMemory } from "process";
import { getUserFromRequest } from "@/lib/auth";
import { getRSCModuleInformation } from "next/dist/build/analysis/get-page-static-info";

// GETリクエスト用のハンドラ
export async function GET(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    // ユーザ認証の箇所
    const user = await getUserFromRequest(req);

    // ログイン中のアカウントがない場合
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: {
        id: user.id,
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
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, response, period } = await req.json();

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: {
        id: user.id,
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
