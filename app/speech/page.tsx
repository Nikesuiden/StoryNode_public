"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { motion } from "framer-motion";
import supabase from "@/lib/supabaseClient";
import TopBar from "@/components/layouts/topBar/topBar";
import { PhoneDisabled } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface DiaryPost {
  id: number;
  content: string;
  emotion: string;
  createdAt: string;
}

export default function Speech() {
  const [prompt, setPrompt] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [diaryToPrompt, setDiaryToPrompt] = useState<string>("");
  const [period, setPeriod] = useState<number>(-1);

  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // APIから日記の一覧を取得する関数
  const fetchDiaryPosts = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      alert("ユーザ認証がされていません。");
      return;
    }

    if (period === -1) {
      setDiaryToPrompt(""); // 期間が未設定の場合、日記情報をクリア
      return;
    }

    try {
      const response = await fetch(`/api/diaryPost?period=${period}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // JWTトークンをヘッダーに追加
        },
      });

      if (response.ok) {
        const data: DiaryPost[] = await response.json();
        const formattedDiary = formatDiaryPosts(data);
        setDiaryToPrompt(formattedDiary);
      } else {
        console.error("Failed to fetch diary posts");
      }
    } catch (error) {
      console.error("Error fetching diary posts:", error);
    }
  }, [period]);

  // 日記データをフォーマットする関数
  function formatDiaryPosts(diaryPosts: DiaryPost[]): string {
    const entriesByYear: {
      [year: string]: {
        [monthDay: string]: {
          emotion: string;
          content: string;
          time: string;
        }[];
      };
    } = {};

    diaryPosts.forEach((post) => {
      const createdAt = new Date(post.createdAt);
      const year = createdAt.getFullYear().toString();
      const monthDay = `${createdAt.getMonth() + 1}/${createdAt.getDate()}`;
      const hours = String(createdAt.getHours()).padStart(2, "0"); // 時間を2桁にフォーマット
      const minutes = String(createdAt.getMinutes()).padStart(2, "0"); // 分を2桁にフォーマット
      const time = `${hours}:${minutes}`; // HH:MM形式に変換

      if (!entriesByYear[year]) {
        entriesByYear[year] = {};
      }
      if (!entriesByYear[year][monthDay]) {
        entriesByYear[year][monthDay] = [];
      }
      entriesByYear[year][monthDay].push({
        emotion: post.emotion,
        content: post.content.replace(/\n/g, ""), // 改行コードを削除
        time: time, // 時間を追加
      });
    });

    let result = "";

    for (const year in entriesByYear) {
      result += `"${year}": {`; // 年を追加
      for (const date in entriesByYear[year]) {
        result += `"${date}": [`; // 月日を追加
        entriesByYear[year][date].forEach((entry, index) => {
          result += `(${entry.emotion}, ${entry.content}, ${entry.time})`; // (感情, 内容, 時間)
          if (index < entriesByYear[year][date].length - 1) {
            result += ", "; // 最後のエントリでない場合はカンマを追加
          }
        });
        result += "]"; // 月日エントリを閉じる
        result += ", "; // 次の月日が続くためカンマを追加
      }
      result = result.slice(0, -2); // 最後の余分なカンマを削除
      result += "}, "; // 年エントリを閉じる
    }

    result = result.slice(0, -2); // 最後の余分なカンマを削除
    return result;
  }

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
          diaryToPrompt,
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

  const periodChange = (event: SelectChangeEvent<number>) => {
    setPeriod(Number(event.target.value as string));
  };

  // 期間が変更されたら日記データを取得します。
  useEffect(() => {
    fetchDiaryPosts();
  }, [period]);

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
    if (period === -1) {
      alert("期間を指定して下さい。");
      return;
    }

    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  // 収録終了時のアクション
  const handleStopListening = () => {
    // 言葉が認識されなかった際の保険
    // if (prompt.length === 0 && recognition) {
    //   alert("文字が認識されませんでした。");
    //   recognition.stop();
    //   setIsListening(false);
    //   setPrompt("");
    //   return;
    // }

    if (recognition) {
      recognition.stop();
      setIsListening(false);
      transcriptSubmit();
      setPrompt("");
    }
  };

  // 期間が変更されたら日記データを取得します。
  useEffect(() => {
    fetchDiaryPosts();
  }, [period]);

  return (
    <Box>
      <Box sx={{ m: 2 }}>
        <TopBar />
      </Box>
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
        <Box
          sx={{ position: "absolute", m: 3 , cursor : "pointer"}}
          onClick={() => handleNavigation("/aichat")}
        >
          <PhoneDisabled sx={{ fontSize: 25 }} />
        </Box>
        <Typography variant="h3" component="h1" gutterBottom>
          音声対話
        </Typography>

        <Box component="form" sx={{ "& > *": { width: "40%" } }} noValidate>
          <FormControl sx={{ minWidth: 120, width: "40%" }} fullWidth>
            <InputLabel
              style={{
                backgroundColor: "white",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              日記の収集期間
            </InputLabel>
            <Select
              value={period}
              onChange={periodChange}
              label="日記の収集期間"
            >
              <MenuItem value={-1}>--未設定--</MenuItem>
              <MenuItem value={0}>今日</MenuItem>
              <MenuItem value={1}>昨日</MenuItem>
              <MenuItem value={2}>一昨日</MenuItem>
              <MenuItem value={6}>1週間</MenuItem>
              <MenuItem value={13}>2週間</MenuItem>
              <MenuItem value={20}>3週間</MenuItem>
              <MenuItem value={30}>1ヶ月</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
          <Typography variant="body1" component="p">
            {diaryToPrompt}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
