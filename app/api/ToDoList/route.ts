import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// ToDoリストの取得（GETリクエスト）
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }

    const todos = await prisma.toDo.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("ToDoリストの取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "ToDoリストの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// POSTリクエスト用ハンドラ
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      console.log("server log1");
    }

    const { todo, chatId } = await req.json();

    // バリデーション
    if (!todo || typeof todo !== "string") {
      return NextResponse.json(
        { error: "Invalid todo content" },
        { status: 400 }
      );
    }

    console.log("server log2");

    // Prismaクエリ実行時に `chatId` が `null` の場合はフィールドを省略
    const newToDo = await prisma.toDo.create({
      data: {
        todo,
        chat: chatId ? { connect: { id: chatId } } : undefined, // chatIdがnullなら省略
        user: {
          connect: { id: user.id },
        },
      },
    });

    console.log("server log3");

    return NextResponse.json(newToDo, { status: 201 });
  } catch (error) {
    // エラーハンドリング
    if (error instanceof Error) {
      console.error(
        "ToDo作成中にエラーが発生しました:",
        error.message,
        error.stack
      );
      console.log("server log4");
      return NextResponse.json(
        { error: "ToDoの作成中にエラーが発生しました", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("予期しないエラーが発生しました:", error);
      console.log('server log5');
      return NextResponse.json(
        { error: "予期しないエラーが発生しました" },
        { status: 500 }
      );
    }
  }
}
