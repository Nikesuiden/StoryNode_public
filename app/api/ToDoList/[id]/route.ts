// app/api/ToDoList/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/utils/supabase/server";

// ToDoの更新（PUTリクエスト）
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error||!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "IDが見つかりませんでした。" }, { status: 400 });
    }

    const { todo } = await req.json();

    if (!todo || typeof todo !== "string") {
      return NextResponse.json(
        { error: "ToDo内容が見つかりません" },
        { status: 400 }
      );
    }

    const existingToDo = await prisma.toDo.findUnique({
      where: { id },
    });

    if (!existingToDo || existingToDo.userId !== data.user.id) {
      return NextResponse.json(
        { error: "ユーザーを見つけることができませんでした。" },
        { status: 404 }
      );
    }

    const updatedToDo = await prisma.toDo.update({
      where: { id },
      data: { todo },
    });

    return NextResponse.json(updatedToDo, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "ToDo更新中にエラーが発生しました:",
        error.message,
        error.stack
      );
      return NextResponse.json(
        { error: "ToDoの更新中にエラーが発生しました", details: error.message },
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

// ToDoの削除（DELETEリクエスト）
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error||!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ToDoのIdが見つかりません" }, { status: 400 });
    }

    const existingToDo = await prisma.toDo.findUnique({
      where: { id },
    });

    if (!existingToDo || existingToDo.userId !== data.user.id) {
      return NextResponse.json(
        { error: "ユーザーをみつけることができませんでした。" },
        { status: 404 }
      );
    }

    await prisma.toDo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "ToDoは削除されました。" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "ToDo削除中にエラーが発生しました:",
        error.message,
        error.stack
      );
      return NextResponse.json(
        { error: "ToDoの削除中にエラーが発生しました", details: error.message },
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
