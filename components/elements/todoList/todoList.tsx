"use client";

import supabase from "@/lib/supabaseClient";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";


 // supabaseClientをインポート

interface ToDo {
  id: number;
  todo: string;
}

interface ToDoListProps {
  initialData: ToDo[] | null;
}

const ToDoList: React.FC<ToDoListProps> = ({ initialData }) => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // ログイン中のユーザーのToDoリストを取得（GET）
  useEffect(() => {
    const fetchToDos = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
          console.error("ユーザーがログインしていません。");
          return;
        }

        const response = await fetch("/api/ToDoList", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`, // 認証トークンを追加
          },
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          setTodos(data); // 配列の場合にのみセット
        } else {
          console.error("予期しないデータ形式:", data);
        }
      } catch (error) {
        console.error("ToDoの取得中にエラーが発生しました:", error);
      }
    };

    fetchToDos();
  }, []);

  // ToDoを更新（PUT）
  const updateTodo = async (id: number) => {
    if (!editingText.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("ユーザーがログインしていません。");
        return;
      }

      const response = await fetch(`/api/ToDoList/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // 認証トークンを追加
        },
        body: JSON.stringify({ todo: editingText }),
      });

      const data = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("ToDoの更新中にエラーが発生しました:", error);
    }
  };

  // ToDoを削除（DELETE）
  const deleteTodo = async (id: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("ユーザーがログインしていません。");
        return;
      }

      const response = await fetch(`/api/ToDoList/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`, // 認証トークンを追加
        },
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("ToDoの削除中にエラーが発生しました:", error);
    }
  };

  // initialData を使ってToDoデータの初期値をセット
  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      setTodos(initialData);
    } else {
      console.error("初期データが無効です:", initialData);
    }
  }, [initialData]);

  return (
    <Box mt={4}>
      {Array.isArray(todos) && todos.length > 0 ? (
        todos.map((todo) => (
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
        ))
      ) : (
        <Typography>ToDoがありません</Typography>
      )}
    </Box>
  );
};

export default ToDoList;
