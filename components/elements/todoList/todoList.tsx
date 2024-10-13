// components/elements/todoList/todoList.tsx

"use client";

import supabase from "@/lib/supabaseClient";
import { Box, Button, TextField, Typography } from "@mui/material";
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
    console.log(isLoading);
    if (initialData) {
      setTodos(initialData);
      setIsLoading(false);
      console.log(isLoading);
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
        <Typography sx={{ ml: 1 }}>Loading...</Typography>
      ) : Array.isArray(todos) && todos.length > 0 ? (
        todos.map((todo) => (
          <Box
            key={todo.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            ml={1}
          >
            {editingId === todo.id ? (
              <>
                <TextField
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 4 }}
                />
                <Box sx={{ flex: 1, display: "flex" }}>
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
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ flex: 4 }}>{todo.todo}</Typography>
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
        ))
      ) : (
        <Typography sx={{ ml: 1 }}>ToDoがありません</Typography>
      )}
    </Box>
  );
};

export default ToDoList;
