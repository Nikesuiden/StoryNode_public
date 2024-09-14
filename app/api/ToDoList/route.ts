// app/api/ToDoList/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GETリクエスト用ハンドラ
export async function GET() {
  try {
    const todos = await prisma.toDo.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        chat: true,
      }
    });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "ToDoの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// POSTリクエスト用ハンドラ
export async function POST(req: Request) {
  try {
    const { todo, chatId } = await req.json();
    const newToDo = await prisma.toDo.create({
      data: {
        todo,
        chatId: chatId || null, // chatIdが提供されていない場合、nullを設定},
      },
    });
    return NextResponse.json(newToDo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "ToDoの作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
