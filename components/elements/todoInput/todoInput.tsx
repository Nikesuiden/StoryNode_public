"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function ToDoInput() {
  const [todoInput, setTodoInput] = useState<string>("");

  const t_maxLength: number = 40; // ToDo入力制限を課す。

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // 制限文字数内でのみ入力可能
    if (inputValue.length <= t_maxLength) {
      setTodoInput(inputValue);
    }
  };
  return (
    <Box>
      <Box>
        <Typography
          sx={{
            color: todoInput?.length === t_maxLength ? "red" : "inherit",
            marginBottom: 0.5,
            marginTop: 1,
          }}
        >
          入力文字数: {todoInput?.length} / {t_maxLength}
        </Typography>
        <Box
          component="form"
          sx={{
            "& > *": {},
            display: "flex",
            justifyContent: "center",
          }}
          noValidate
        >
          <TextField
            label="ToDoを記入してください"
            variant="outlined"
            multiline
            maxRows={1}
            style={{
              backgroundColor: "white",
              flex: 8,
              marginRight: 5,
              marginTop: 2
            }}
            onChange={handleChange}
            inputProps={{ maxLength: t_maxLength }}
          ></TextField>
          <Button variant="contained" color="primary" style={{ flex: 1 }}>
            追加
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
