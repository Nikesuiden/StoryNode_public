import { PrismaClient } from "@prisma/client/extension";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function DiaryPostHander(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    // 全てのDiaryPostを取得する
    try {
      const diaryPosts = await prisma.diaryPosts.findMany();
      res.status(200).json(diaryPosts);
    } catch (error) {
      res.status(500).json({ error: "Error fetching diary posts" });
    }
  } else if (req.method === "POST") {
    // 新しいDiaryPostの作成
    const { content, emotion } = req.body;
    try {
      const newdiaryPost = await prisma.diaryPosts.create({
        data: { content, emotion },
      });
      res.status(201).json(newdiaryPost);
    } catch (error) {
      res.status(500).json({ error: "Error creating diary post" });
    }
  } else {
    // その他のHTTPメソッドは許可しない
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
