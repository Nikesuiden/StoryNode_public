import { NextResponse } from 'next/server';
import OpenAI from "openai";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_SELF || "",
});

export async function POST(req: Request) {
  const { input } = await req.json();

  if (!input) {
    return NextResponse.json({ message: "Invalid input" }, { status: 407 });
  }

  try {
    const SpeechFile = path.resolve("./public/audio/speech.mp3");

    // OpenAIにリクエスト
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: input,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return NextResponse.json({ message: "Error generating speech" }, { status: 500 });
  }
}
