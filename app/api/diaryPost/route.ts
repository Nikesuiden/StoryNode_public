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

// PUTリクエスト用のハンドラ (更新)
export async function PUT(req: Request) {
  try {
    const { id, content, emotion } = await req.json();
    const post = await prisma.diaryPost.findUnique({
      where: { id: Number(id) },
    });
    if (!post) {
      return NextResponse.json({ error: "Diary post not found" }, { status: 404 });
    }
    const updatedDiaryPost = await prisma.diaryPost.update({
      where: { id: Number(id) },
      data: { content, emotion },
    });
    return NextResponse.json(updatedDiaryPost, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating diary post" }, { status: 500 });
  }
}

// DELETEリクエスト用のハンドラ (削除)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const post = await prisma.diaryPost.findUnique({
      where: { id: Number(id) },
    });
    if (!post) {
      return NextResponse.json({ error: "Diary post not found" }, { status: 404 });
    }
    await prisma.diaryPost.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Diary post deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting diary post" }, { status: 500 });
  }
}