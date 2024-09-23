"use client";

import { supabase } from "@/lib/supabaseClient";
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
import { useState, useEffect } from "react";

interface DiaryPost {
  id: number;
  content: string;
  emotion: string;
}

interface DiaryInputProps {
  onAction: () => void; // ボタンがクリックされたら親の関数を呼ぶ
}

const DiaryInput: React.FC<DiaryInputProps> = ({ onAction }) => {
  const d_maxLength: number = 200; /// 入力上限定義
  const [diaryInput, setDiaryInput] = useState<string>("");
  const [inputEmotion, setInputEmotion] = useState<string>("none");

  // handleChange関数を追加
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // 300文字を超えない場合のみ状態を更新する
    if (inputValue.length <= d_maxLength) {
      setDiaryInput(inputValue);
    }
  };

  const inputEmotionChange = (event: SelectChangeEvent) => {
    setInputEmotion(event.target.value as string);
  };

  /// フォーム送信時の処理
  const handleSubmit = async () => {
    if (!diaryInput) {
      alert("日記の内容を記入してください。");
      return;
    }
    try {
      // Supabase からセッション情報を取得
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        alert("ログインが必要です。");
        return;
      }

      const response = await fetch("/api/diaryPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // JWT トークンを Authorization ヘッダーに追加
        },
        body: JSON.stringify({ content: diaryInput, emotion: inputEmotion }),
      });

      if (response.ok) {
        setDiaryInput("");
        setInputEmotion("none"); // 初期化
        onAction(); // DB保存が成功した場合のみ発動
      } else {
        alert("エラーが発生しました。もう一度お試しください。");
      }
    } catch (error) {
      console.log("送信エラー");
      console.error("Error creating diary post:", error);
      alert("サーバーとの通信中にエラーが発生しました。");
    }
  };

  return (
    <Box sx={{ borderColor: "gray", borderRadius: 1, marginBottom: 2 }}>
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
            Emotion
          </InputLabel>
          <Select
            sx={{ width: "40%" }}
            value={inputEmotion}
            placeholder="Emotion"
            onChange={inputEmotionChange}
          >
            <MenuItem value={"none"}>--未設定--</MenuItem>
            <MenuItem value={"grad"}>嬉しい</MenuItem>
            <MenuItem value={"Funny"}>楽しみ</MenuItem>
            <MenuItem value={"expectations"}>期待</MenuItem>
            <MenuItem value={"happy"}>幸せ</MenuItem>
            <MenuItem value={"surprise"}>驚き</MenuItem>
            <MenuItem value={"sad"}>悲しい</MenuItem>
            <MenuItem value={"angry"}>怒り</MenuItem>
            <MenuItem value={"anxiety"}>不安</MenuItem>
          </Select>
        </FormControl>
        <Typography
          sx={{
            fontSize: 15,
            color: diaryInput?.length === d_maxLength ? "red" : "inherit",
            marginBottom: 1,
            marginTop: 2,
          }}
        >
          入力制限: {diaryInput === "" ? "0" : diaryInput?.length} /{" "}
          {d_maxLength}文字
        </Typography>
        {/* <Typography>{inputEmotion}</Typography> */}
        <TextField
          label="日記を記入してください"
          variant="outlined"
          multiline
          value={diaryInput}
          rows={4}
          style={{
            backgroundColor: "white",
          }}
          onChange={handleChange}
          inputProps={{
            maxLength: d_maxLength, // 300文字までしか入力できないように設定
          }}
        ></TextField>
        <Button
          variant="contained"
          type="button"
          sx={{ marginTop: 2, height: "40px" }}
          onClick={handleSubmit}
        >
          記録する
        </Button>

        {/* <Typography>{diaryInput}</Typography>
        <Typography>{inputEmotion}</Typography> */}
      </Box>
    </Box>
  );
};

export default DiaryInput;
