import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// ToDoリストの取得（GETリクエスト）
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "認証されていません" }, { status: 401 });
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
    return NextResponse.json({ error: "ToDoリストの取得中にエラーが発生しました" }, { status: 500 });
  }
}

// POSTリクエスト用ハンドラ
export async function POST(req: NextRequest) {
  try {
    // ユーザー情報をリクエストから取得
    const user = await getUserFromRequest(req);
    
    // ユーザーが認証されていない場合、401エラーを返す
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // リクエストボディから todo と chatId を取得
    const { todo, chatId } = await req.json();

    // バリデーション：todoが無効な場合、400エラーを返す
    if (!todo || typeof todo !== "string") {
      return NextResponse.json({ error: "Invalid todo content" }, { status: 400 });
    }

    // chatIdがある場合は数値であることを確認
    if (chatId && typeof chatId !== "number") {
      return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
    }

    // 新しいToDoをデータベースに作成
    const newToDo = await prisma.toDo.create({
      data: {
        todo,
        chatId: chatId || null,  // chatIdがない場合はnullに設定
        user: {
          connect: { id: user.id },  // 認証されたユーザーに関連付け
        },
      },
    });

    // 作成に成功した場合、201ステータスで新しいToDoを返す
    return NextResponse.json(newToDo, { status: 201 });

  } catch (error) {
    // エラーハンドリング：エラーの詳細をコンソールに出力
    console.error("ToDo作成中にエラーが発生しました:", error.message, error.stack);
    
    // エラーレスポンスを返す
    return NextResponse.json(
      { error: "ToDoの作成中にエラーが発生しました", details: error.message },
      { status: 500 }
    );
  }
}