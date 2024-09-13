// app/api/todo/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// PUTリクエスト用のハンドラ (更新)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const { todo } = await req.json();

  try {
    const updatedToDo = await prisma.toDo.update({
      where: { id: id },
      data: { todo },
    });

    return NextResponse.json(updatedToDo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "ToDoの更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// DELETEリクエスト用のハンドラ (削除)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    // 削除するToDoが存在するか確認
    const toDoItem = await prisma.toDo.findUnique({
      where: { id: id },
    });

    if (!toDoItem) {
      return NextResponse.json(
        { error: "ToDoが見つかりません" },
        { status: 404 }
      );
    }

    // ToDoエントリを削除
    await prisma.toDo.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "ToDoを正常に削除しました" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "ToDoの削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
