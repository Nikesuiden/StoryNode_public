// app/api/diaryPost/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
