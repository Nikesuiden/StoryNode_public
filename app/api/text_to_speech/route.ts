import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";
const ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN; // 環境変数からアクセストークンを取得

export async function POST(request: NextRequest) {
  const { text } = await request.json();
  
  const requestBody = {
    input: {
      text: text, // クライアントから渡されたテキスト
    },
    voice: {
      languageCode: "ja-JP",
      name: "ja-JP-Standard-A",
      ssmlGender: "MALE",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  };

  try {
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`, // アクセストークンをヘッダーに設定
        "x-goog-user-project": process.env.PROJECT_ID, // プロジェクトIDもヘッダーに設定
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    // 生成された音声データをレスポンスとして返す
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error calling Text-to-Speech API:", error);
    return NextResponse.json(
      { error: "エラーが発生しました。" },
      { status: 500 }
    );
  }
}
