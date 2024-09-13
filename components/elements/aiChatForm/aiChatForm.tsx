"use client";

import { useState } from "react";
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

const AiChatForm: React.FC = () => {
  const d_maxLength: number = 4000; // 入力上限定義
  const [chatPrompt, setChatPrompt] = useState<string>("");
  const [period, setPeriod] = useState<number>(-1);

  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false); // ストリーミングが完了したかどうか

  const handleSubmit = async () => {
    setResponse(""); // 初期化
    setIsComplete(false); // ストリーミング開始

    // API呼び出し
    const res = await fetch("/api/chatGPT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
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

  // ChatHistoryをDBに保存する関数
  const saveChatHistory = async (
    prompt: string,
    response: string,
    period: number
  ) => {
    try {
      const res = await fetch("/api/chatHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
  if (isComplete && response) {
    saveChatHistory(prompt, response, period);
    setIsComplete(false); // 一度保存したら完了フラグをリセット
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= d_maxLength) {
      setChatPrompt(inputValue);
    }
  };

  const periodChange = (event: SelectChangeEvent<number>) => {
    setPeriod(Number(event.target.value as string));
  };

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
          <Select sx={{ width: "40%" }} value={period} onChange={periodChange}>
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
        <Typography
          sx={{
            fontSize: 15,
            color: chatPrompt?.length === d_maxLength ? "red" : "inherit",
            marginBottom: 1,
            marginTop: 2,
          }}
        >
          入力文字制限: {chatPrompt === "" ? "0" : chatPrompt?.length} /{" "}
          {d_maxLength}文字
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
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          inputProps={{
            maxLength: d_maxLength,
          }}
        ></TextField>
        <Button
          variant="contained"
          sx={{ marginTop: 2, height: "40px" }}
          onClick={handleSubmit}
        >
          質問
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
