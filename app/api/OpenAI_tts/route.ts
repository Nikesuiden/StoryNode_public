import { NextApiResponse, NextApiRequest } from "next";
import OpenAI from "openai";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_SELF || "",
});

export async function OpenAI_TTS(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = req.body.input;

  if (!input) {
    return res.status(407).json({ message: "Invalid input" });
  }
  // POST以外のリクエストを遮断
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    const SpeechFile = path.resolve("./public/audio/speech.mp3");

    // openaiにリクエスト
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: input,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).json({ message: "Error generating speech" });
  }
}
