import { NextResponse } from "next/server";

let conversationHistory: Array<{ role: string; content: string }> = [];

export async function POST(request: Request) {
  const { prompt, diaryToPrompt } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  // 最初のリクエストの際にGPTに役割を付与する。
  // if (conversationHistory.length === 0) {
  conversationHistory.push({
    role: "system",
    content: `あなたはユーザーの日記を主観的にとらえ、内容に沿って過去のユーザという人格でユーザーに語りかけるような形で主観的に演じてください。「こんにちは、私は過去のあなたです。」という挨拶から始まり、ユーザーにあたかも過去の自分を会話しているような体験を提供してください。ただし全ての質問に対して単なる日記の書き写しは厳禁です。日記:${diaryToPrompt} 質問: ${prompt}`,
  });
  // }

  // 会話の履歴に新しいユーザーの発言を追加
  conversationHistory.push({ role: "user", content: prompt });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationHistory, // これまでの会話履歴を含める
        max_token: 300
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error fetching response from OpenAI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // 会話の履歴にAIの応答を追加
    conversationHistory.push({ role: "assistant", content: assistantMessage });

    return NextResponse.json({ completion: assistantMessage });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching response" },
      { status: 500 }
    );
  }
}
