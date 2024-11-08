// components/elements/todoList/todoList.tsx

"use client";

import supabase from "@/lib/supabaseClient";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";

interface ToDo {
  id: number;
  todo: string;
}

interface ToDoListProps {
  initialData: ToDo[] | null;
  onAction: () => void; // データ更新時に親コンポーネントの関数を呼び出す
}

const ToDoList: React.FC<ToDoListProps> = ({ initialData, onAction }) => {
  const [todos, setTodos] = useState<ToDo[]>(initialData || []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // initialData が変更されたときに todos を更新
  useEffect(() => {
    setIsLoading(true);
    if (initialData) {
      setTodos(initialData);
      setIsLoading(false);
    }
  }, [initialData]);

  // ToDoを更新（PUT）
  const updateTodo = async (id: number) => {
    if (!editingText.trim()) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("ユーザーがログインしていません。");
        return;
      }

      const response = await fetch(`/api/ToDoList/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ todo: editingText }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditingText("");
        onAction(); // データを再取得
      } else {
        console.error("ToDoの更新中にエラーが発生しました");
      }
    } catch (error) {
      console.error("ToDoの更新中にエラーが発生しました:", error);
    }
  };

  // ToDoを削除（DELETE）
  const deleteTodo = async (id: number) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("ユーザーがログインしていません。");
        return;
      }

      const response = await fetch(`/api/ToDoList/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        onAction(); // データを再取得
      } else {
        console.error("ToDoの削除中にエラーが発生しました");
      }
    } catch (error) {
      console.error("ToDoの削除中にエラーが発生しました:", error);
    }
  };

  return (
    <Box mt={4}>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : Array.isArray(todos) && todos.length > 0 ? (
        todos.map((todo) => (
          <Box
            key={todo.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            {editingId === todo.id ? (
              <>
                <TextField
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  variant="outlined"
                  size="small"
                  multiline
                  sx={{ flex: 1 }}
                />
                <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateTodo(todo.id)}
                  >
                    保存
                  </Button>
                  <Button variant="text" onClick={() => setEditingId(null)}>
                    キャンセル
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography sx={{ flex: 1, textAlign: "left" }}>
                  {todo.todo}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingText(todo.todo);
                    }}
                  >
                    編集
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    削除
                  </Button>
                </Box>
              </>
            )}
          </Box>
        ))
      ) : (
        <Typography>ToDoがありません</Typography>
      )}
    </Box>
  );
};

export default ToDoList;
