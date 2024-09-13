"use client";

import { flexbox } from "@chakra-ui/react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface ToDo {
  id: number;
  todo: string;
}

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
      })
      .catch((error) =>
        console.error("ToDoの追加中にエラーが発生しました:", error)
      );
  };

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

      {/* ToDoリストの表示 */}
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
                  <Box sx={{ display: "flex",flex: 1 }}>
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
    </Box>
  );
}
