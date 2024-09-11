import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// PUT (更新)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const { content, emotion } = await req.json();

  try {
    const updatedDiaryPost = await prisma.diaryPost.update({
      where: { id: id },
      data: { content, emotion },
    });

    return NextResponse.json(updatedDiaryPost, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating diary post" },
      { status: 500 }
    );
  }
}

// DELETEリクエスト用のハンドラ (削除)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const postId = Number(params.id);

  try {
    // 削除する日記が存在するか確認
    const post = await prisma.diaryPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Diary post not found" },
        { status: 404 }
      );
    }

    // 日記エントリを削除
    await prisma.diaryPost.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { message: "Diary post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting diary post" },
      { status: 500 }
    );
  }
}
