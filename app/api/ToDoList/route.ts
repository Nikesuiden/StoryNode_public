// app/api/ToDoList/route.ts

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { supabase } from "@supabase/auth-ui-shared";

// ToDoリストの取得（GETリクエスト）
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }

    const todos = await prisma.toDo.findMany({
      where: { userId: data.user.id },
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

// ToDoの作成（POSTリクエスト）
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { todo } = await req.json();

    // バリデーション
    if (!todo || typeof todo !== "string") {
      return NextResponse.json(
        { error: "Invalid todo content" },
        { status: 400 }
      );
    }

    // 新しいToDoを作成
    const newToDo = await prisma.toDo.create({
      data: {
        todo,
        user: {
          connect: { id: data.user.id },
        },
      },
    });

    return NextResponse.json(newToDo, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "ToDo作成中にエラーが発生しました:",
        error.message,
        error.stack
      );
      return NextResponse.json(
        { error: "ToDoの作成中にエラーが発生しました", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("予期しないエラーが発生しました:", error);
      return NextResponse.json(
        { error: "予期しないエラーが発生しました" },
        { status: 500 }
      );
    }
  }
}
