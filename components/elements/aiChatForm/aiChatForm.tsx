"use client";

import { Stream } from "@mui/icons-material";
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
import { useState } from "react";

export default function AiChatForm() {
  const d_maxLength: number = 4000; /// 入力上限定義
  const [chatPrompt, setChatPrompt] = useState<string>("");
  const [period, setPeriod] = useState<number>(-1);

  // ここからGPTのAPI~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleSubmit = async () => {
    setResponse(""); // 初期化

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
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        const chunk = decoder.decode(value, { stream: true });

        // 'data: ' で始まる行だけを処理
        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const jsonString = line.replace("data: ", "").trim(); // 'data: 'を削除

          if (jsonString !== "[DONE]") {
            try {
              const parsedChunk = JSON.parse(jsonString);
              const content = parsedChunk.choices[0]?.delta?.content;

              if (content) {
                setResponse((prev) => prev + content);
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }
    }
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // handleChange関数を追加
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // 300文字を超えない場合のみ状態を更新する
    if (inputValue.length <= d_maxLength) {
      setChatPrompt(inputValue);
    }
  };

  const periodChange = (event: SelectChangeEvent<number>) => {
    setPeriod(Number(event.target.value as string));
  };

  return (
    <Box sx={{ borderColor: "gray", borderRadius: 1, marginBottom: 2, mt: 2 }}>
      <Box
        component="form"
        sx={{
          "& > *": {
            width: "100%",
          },
        }}
        noValidate
      >
        <FormControl
          sx={{
            minWidth: 120,
          }}
          fullWidth
        >
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
            maxLength: d_maxLength, // 300文字までしか入力できないように設定
          }}
        ></TextField>
        <Button
          variant="contained"
          sx={{ marginTop: 2, height: "40px" }}
          onClick={handleSubmit}
        >
          質問
        </Button>
        <Typography>{period}</Typography>
      </Box>
      <Box>
        <Typography>Response:</Typography>
        <Typography>{response}</Typography>
      </Box>
    </Box>
  );
}
