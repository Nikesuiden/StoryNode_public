"use client";

import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { createStyles, makeStyles, Theme, styled } from "@mui/material/styles";

export default function DiaryInput() {
  const [diaryInput, setDiaryInput] = useState<string>();
  //   const [diaryEmotion, setDiaryEmotion] = useState<string>();

  // handleChange関数を追加
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // 300文字を超えない場合のみ状態を更新する
    if (inputValue.length <= 300) {
      setDiaryInput(inputValue);
    }
  };

  return (
    <Box>
      <Box>
        <Box
          component="form"
          sx={{
            "& > *": {
              width: "100%",
            },
          }}
          noValidate
        >
          <TextField
            label="日記を記入してください"
            variant="outlined"
            multiline
            maxRows={4}
            style={{
              backgroundColor: "white",
            }}
            onChange={handleChange}
          ></TextField>
          <Typography sx={{backgraundColor:'white', fontSize: 100}}>{diaryInput}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
