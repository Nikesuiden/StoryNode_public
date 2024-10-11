// components/elements/todoInput/todoInput.tsx

"use client";

import supabase from "@/lib/supabaseClient";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface ToDoInputProps {
  onAction: () => void;
}

const ToDoInput: React.FC<ToDoInputProps> = ({ onAction }) => {
  const [todoInput, setTodoInput] = useState<string>("");

  const t_maxLength: number = 40; // ToDo入力制限を課す。

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // 制限文字数内でのみ入力可能
    if (inputValue.length <= t_maxLength) {
      setTodoInput(inputValue);
    }
  };

  // 新しいToDoを追加（POST）
  const addTodo = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return;
    }

    const response = await fetch("/api/ToDoList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ todo: todoInput }),
    });

    if (response.ok) {
      setTodoInput("");
      await onAction();
      alert("保存に成功しました。");
    } else {
      const errorData = await response.json();
      console.error("エラー詳細:", errorData);
      alert("エラーが発生しました。もう一度お試しください。");
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
            maxRows={1}
            style={{
              backgroundColor: "white",
              flex: 8,
              marginRight: 5,
              marginTop: 2,
            }}
            onChange={handleChange}
            value={todoInput}
            inputProps={{ maxLength: t_maxLength }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ flex: 1 }}
            onClick={addTodo}
          >
            追加
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ToDoInput;
