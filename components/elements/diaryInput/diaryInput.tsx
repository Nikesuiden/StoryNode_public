"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import { useState } from "react";
import { createStyles, makeStyles, Theme, styled } from "@mui/material/styles";

interface DiaryPost {
  id: number;
  content: string;
  emotion: string;
}

export default function DiaryInput() {

  const d_maxLength: number = 200; /// 入力上限定義
  const [diaryInput, setDiaryInput] = useState<string>("");
  const [inputEmotion, setInputEmotion] = useState<string>("none");

    // API送信用
    const 
  

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
          入力文字制限: {diaryInput === "" ? "0" : diaryInput?.length} /{" "}
          {d_maxLength}文字
        </Typography>
        {/* <Typography>{inputEmotion}</Typography> */}
        <TextField
          label="日記を記入してください"
          variant="outlined"
          multiline
          rows={4}
          style={{
            backgroundColor: "white",
          }}
          onChange={handleChange}
          inputProps={{
            maxLength: d_maxLength, // 300文字までしか入力できないように設定
          }}
        ></TextField>
        <Button variant="contained" sx={{ marginTop: 2, height: "40px" }}>
          記録する
        </Button>
      </Box>
    </Box>
  );
}
