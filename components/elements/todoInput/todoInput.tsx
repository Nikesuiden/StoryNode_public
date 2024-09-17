"use client";

import { flexbox } from "@chakra-ui/react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface ToDo {
  id: number;
  todo: string;
}

interface ToDoListProps {
  onAction: () => void;
}

const ToDoInput: React.FC<ToDoListProps> = ({ onAction }) => {
  const [todoInput, setTodoInput] = useState<string>("");

  const t_maxLength: number = 40; // ToDo入力制限を課す。

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // 制限文字数内でのみ入力可能
    if (inputValue.length <= t_maxLength) {
      setTodoInput(inputValue);
    }
  };

  const [todos, setTodos] = useState<ToDo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // ToDoリストを取得（GET）
  useEffect(() => {
    fetch("/api/ToDoList")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) =>
        console.error("ToDoの取得中にエラーが発生しました:", error)
      );
  }, []);

  // 新しいToDoを追加（POST）
  const addTodo = () => {
    if (!todoInput.trim()) return;

    fetch("/api/ToDoList", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: todoInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([data, ...todos]);
        setTodoInput("");
        onAction();
      })
      .catch((error) =>
        console.error("ToDoの追加中にエラーが発生しました:", error)
      );
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
