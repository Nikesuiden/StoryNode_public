// pages/api/auth/callback.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ error: "ユーザーデータが提供されていません" });
    }

    // ユーザーが存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      // ユーザーを作成
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
      return res.status(200).json({ user: newUser });
    } else {
      return res.status(200).json({ user: existingUser });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
