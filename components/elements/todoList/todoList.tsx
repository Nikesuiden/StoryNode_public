"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface ToDo {
  id: number;
  todo: string;
}

export default function ToDoList() {
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

  // ToDoを更新（PUT）
  const updateTodo = (id: number) => {
    if (!editingText.trim()) return;

    fetch(`/api/ToDoList/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: editingText }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
        setEditingId(null);
        setEditingText("");
      })
      .catch((error) =>
        console.error("ToDoの更新中にエラーが発生しました:", error)
      );
  };

  // ToDoを削除（DELETE）
  const deleteTodo = (id: number) => {
    fetch(`/api/ToDoList/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) =>
        console.error("ToDoの削除中にエラーが発生しました:", error)
      );
  };

  return (
    <Box mt={4}>
      {todos.map((todo) => (
        <Box key={todo.id} display="flex" alignItems="center" mb={2}>
          {editingId === todo.id ? (
            <>
              <TextField
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateTodo(todo.id)}
                style={{ marginLeft: 8 }}
              >
                保存
              </Button>
              <Button
                variant="text"
                onClick={() => setEditingId(null)}
                style={{ marginLeft: 8 }}
              >
                キャンセル
              </Button>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ flex: 4 }}>
                  <Typography>{todo.todo}</Typography>
                </Box>
                <Box sx={{ display: "flex", flex: 1 }}>
                  <Button
                    variant="text"
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingText(todo.todo);
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    編集
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => deleteTodo(todo.id)}
                    style={{ marginLeft: 8 }}
                  >
                    削除
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}
