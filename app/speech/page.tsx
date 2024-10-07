"use client";

import { useState, useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [diaryToPrompt, setDiaryToPrompt] = useState<string>("");

  // gpt呼び出し 手動で入力
  const transcriptSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gpt_for_speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "送信に失敗しました。");
      }

      const { completion } = await res.json();
      setResponse(completion);
    } catch (error: any) {
      alert(error.message || "レスポンス取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "ja-JP"; // 日本語に設定
        setRecognition(recognitionInstance);

        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setPrompt((prev) => prev + transcriptPart);
            } else {
              interimTranscript += transcriptPart;
            }
          }
        };
      } else {
        alert("このブラウザは Web Speech API をサポートしていません。");
      }
    }
  }, []);

  // 収録開始時のアクション
  const handleStartListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  // 収録終了時のアクション
  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      transcriptSubmit();
      setPrompt("");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        音声対話
      </Typography>

      <Box sx={{ mt: 3 }}>
        {!isListening ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartListening}
            component={motion.div}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            マイクを開始
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleStopListening}
            component={motion.div}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            マイクを停止
          </Button>
        )}
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ mt: 4 }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          〜 文字起こし結果 〜
        </Typography>
        <Typography variant="body1" component="p">
          {prompt}
        </Typography>
        <br />
        <Typography variant="h5" component="h2" gutterBottom>
          〜 GPTの返答 〜
        </Typography>
        <Typography variant="body1" component="p">
          {response}
        </Typography>
      </Box>
    </Container>
  );
}
