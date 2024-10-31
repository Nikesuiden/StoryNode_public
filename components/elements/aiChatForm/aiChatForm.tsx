"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { createServerSupabaseClient } from "@/utils/supabase/server";

interface DiaryPost {
  id: number;
  content: string;
  emotion: string;
  createdAt: string;
}

const rainbowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AiChatForm: React.FC = async () => {
  const d_maxLength: number = 7000; // 入力上限定義

  const [period, setPeriod] = useState<number>(-1);

  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false); // ストリーミングが完了したかどうか
  const [isGenerating, setIsGenerating] = useState<boolean>(false); // GPT応答生成中かどうか

  const [diaryToPrompt, setDiaryToPrompt] = useState<string>("");

  const [totalPrompt, setTotalPrompt] = useState<string>("");

  const supabase = await createServerSupabaseClient();

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

  const handleSubmit = async () => {
    if (period === -1) {
      alert("日記収集期間を選択してください。");
      return;
    }

    if (prompt === "") {
      alert("プロンプトを入力してください。");
      return;
    }

    setResponse(""); // 初期化
    setIsComplete(false); // ストリーミング開始
    setIsGenerating(true); // 応答生成開始

    // 最新の prompt を使用して SystemPrompt を定義
    const SystemPrompt: string = `ユーザーの日記から要望に応じたアドバイスを返信し、同じトピックや人物に関する日記があった場合、要約にまとめてください。回答の構成は、日記情報の内容に沿った上でユーザの質問や相談内容に対する返事のみです。また回答で日記情報を活用する際にはその内容を具体的に記載してください。ユーザーに提供できる情報は推測、または少しでも手がかりになる事柄も含めすべて提供するよう努めてください。ただし全ての質問に対して単なる日記の書き写しは厳禁です。日記情報は[日付,内容)]の形式です。日記: ${diaryToPrompt} 質問: ${prompt}`;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return;
    }

    // API呼び出し
    const res = await fetch("/api/chatGPT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`, // JWTトークンをヘッダーに追加
      },
      body: JSON.stringify({ prompt: SystemPrompt }), // キー名を修正
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      let done = false;
      let incompleteChunk = ""; // 不完全なチャンクを一時的に保持

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        const chunk = decoder.decode(value, { stream: true });

        // 不完全なチャンクが前のチャンクの最後と繋がる可能性があるため、それを追加
        incompleteChunk += chunk;

        // 'data: ' で始まる行だけを処理
        const lines = incompleteChunk
          .split("\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const jsonString = line.replace("data: ", "").trim();

          if (jsonString === "[DONE]") {
            // ストリーミングが完了した場合
            setIsComplete(true); // 完了フラグを立てる
            setIsGenerating(false); // 応答生成完了
            break;
          }

          try {
            // JSONとして有効か確認
            const parsedChunk = JSON.parse(jsonString);
            const content = parsedChunk.choices[0]?.delta?.content;

            if (content) {
              // チャンクごとにレスポンスを追加
              setResponse((prev) => prev + content);
            }
          } catch (error) {
            // JSONが未完了の場合は、次のチャンクで処理を続ける
            console.error(
              "Error parsing JSON (ignoring incomplete chunk):",
              error
            );
            continue;
          }
        }

        // 最後の行が不完全だった場合、次のチャンクと繋げるため保存
        incompleteChunk = incompleteChunk.split("\n").slice(-1)[0];
      }
    }
  };

  // APIから日記の一覧を取得する関数
  const fetchDiaryPosts = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
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
  };

  // ChatHistoryをDBに保存する関数
  const saveChatHistory = async (
    prompt: string,
    response: string,
    period: number
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return;
      }
      const res = await fetch("/api/chatHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // JWT トークンを Authorization ヘッダーに追加
        },
        body: JSON.stringify({ prompt, response, period }),
      });

      if (!res.ok) {
        const errorText = await res.text(); // エラー詳細を取得
        console.error(`Error details: ${errorText}`);
        throw new Error(
          `Failed to save chat history: ${res.status} ${res.statusText}`
        );
      }

      console.log("Chat history saved successfully");
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // ストリーミングが完了したら保存
  useEffect(() => {
    if (isComplete && response) {
      saveChatHistory(prompt, response, period);
      setIsComplete(false); // 一度保存したら完了フラグをリセット
    }
  }, [isComplete, response]);

  // 文字数カウント
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (inputValue.length + diaryToPrompt.length <= d_maxLength) {
      setPrompt(inputValue);
    }
  };

  const periodChange = (event: SelectChangeEvent<number>) => {
    setPeriod(Number(event.target.value as string));
  };

  // 都度 total 値が更新されるよう設計
  const totalPromptChange = () => {
    setTotalPrompt(prompt + diaryToPrompt);
  };

  useEffect(() => {
    totalPromptChange();
  }, [prompt, diaryToPrompt]);

  // 期間が変更されたら日記データを取得します。
  useEffect(() => {
    fetchDiaryPosts();
  }, [period]);

  return (
    <Box sx={{ borderColor: "gray", borderRadius: 1, marginBottom: 2, mt: 2 }}>
      <Box component="form" sx={{ "& > *": { width: "100%" } }} noValidate>
        <FormControl sx={{ minWidth: 120 }} fullWidth>
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
            sx={{ width: "40%" }}
            value={period}
            onChange={periodChange}
            label="日記の収集期間"
          >
            <MenuItem value={-1}>--未設定--</MenuItem>
            <MenuItem value={1}>今日</MenuItem>
            <MenuItem value={2}>昨日</MenuItem>
            <MenuItem value={3}>一昨日</MenuItem>
            <MenuItem value={7}>1週間</MenuItem>
            <MenuItem value={14}>2週間</MenuItem>
            <MenuItem value={21}>3週間</MenuItem>
            <MenuItem value={31}>1ヶ月</MenuItem>
          </Select>
        </FormControl>
        <Typography
          sx={{
            fontSize: 15,
            color: totalPrompt?.length === d_maxLength ? "red" : "inherit",
            marginBottom: 1,
            marginTop: 2,
          }}
        >
          入力文字制限: {totalPrompt === "" ? "0" : totalPrompt?.length} /{" "}
          {d_maxLength}
          文字
        </Typography>
        <TextField
          label="プロンプトを入力して下さい"
          variant="outlined"
          multiline
          rows={4}
          value={prompt}
          style={{
            backgroundColor: "white",
          }}
          onChange={handleChange}
          inputProps={{
            maxLength: d_maxLength,
          }}
        ></TextField>

        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            height: "40px",
            borderRadius: "30px",
            ...(isGenerating && {
              animation: `${rainbowAnimation} 3s linear infinite`,
              background:
                "linear-gradient(270deg, #fe6d6d, #ffbf7f, #ffff7f, #7cff7c, #7a7aff, #ce89ff, #cb5dfa)",
              backgroundSize: "400% 400%",
              color: "white",
              borderRadius: "30px",
            }),
          }}
          onClick={handleSubmit}
          disabled={isGenerating} // 生成中はボタンを無効化
        >
          {!isGenerating && "質問"}
        </Button>
      </Box>
      <br />
      <Box>
        <Typography>{response}</Typography>
      </Box>
    </Box>
  );
};

export default AiChatForm;
