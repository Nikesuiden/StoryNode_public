// app/api/diaryPost/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OrderedList } from "@chakra-ui/react";

const prisma = new PrismaClient();

// GETリクエスト用のハンドラをエクスポート
export async function GET() {
  try {
    const diaryPosts = await prisma.diaryPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(diaryPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching diary posts" },
      { status: 500 }
    );
  }
}

// POSTリクエスト用のハンドラをエクスポート
export async function POST(req: Request) {
  try {
    const { content, emotion } = await req.json();
    const newDiaryPost = await prisma.diaryPost.create({
      data: { content, emotion },
    });
    return NextResponse.json(newDiaryPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating diary post" },
      { status: 500 }
    );
  }
}

// PUTリクエスト用のハンドラをエクスポート (更新)
export async function PUT(req: Request) {
  try {
    const { id, content, emotion } = await req.json();
    const updatedDiaryPost = await prisma.diaryPost.update({
      where: { id: Number(id) },
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

// DELETEリクエスト用のハンドラをエクスポート (削除)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.diaryPost.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Diary post deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting diary post" },
      { status: 500 }
    );
  }
}