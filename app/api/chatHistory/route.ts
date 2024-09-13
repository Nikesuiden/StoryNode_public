import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GETリクエスト用のハンドラ
export async function GET() {
  try {
    const chatHistorys = await prisma.chatHistory.findMany({
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
export async function POST(req: Request) {
    try {
      const { prompt, response, period } = await req.json();
  
      const newChatHistory = await prisma.chatHistory.create({
        data: {
          prompt,
          response,
          period,
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