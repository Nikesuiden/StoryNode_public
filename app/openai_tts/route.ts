import type { NextApiRequest, NextApiResponse } from 'next';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // .env.local で管理

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/text-to-speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: 'ja-JP-Standard-A',
      }),
    });

    if (!response.ok) {
      throw new Error('TTS API request failed');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    res.status(200).json({ audioUrl });
  } catch (error) {
    console.error('Error processing TTS request:', error);
    res.status(500).json({ message: 'Failed to process TTS request' });
  }
}
