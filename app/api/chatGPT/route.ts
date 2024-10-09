import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        stream: true, // ストリームを有効にする
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader!.read();
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(value);
      },
    });

    const streamResponse = new Response(stream);
    return streamResponse;
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching response' }, { status: 500 });
  }
}