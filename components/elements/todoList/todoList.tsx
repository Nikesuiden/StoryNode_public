// ToDoList.tsx

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
  onAction: () => void; // Add this prop to trigger data refresh in parent
}

const ToDoList: React.FC<ToDoListProps> = ({ initialData, onAction }) => {
  const [todos, setTodos] = useState<ToDo[]>(initialData || []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // Update todos when initialData changes
  useEffect(() => {
    if (initialData) {
      setTodos(initialData);
    }
  }, [initialData]);

  // Update ToDo (PUT)
  const updateTodo = async (id: number) => {
    if (!editingText.trim()) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("User is not logged in.");
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
        onAction(); // Refresh data in parent
      } else {
        console.error("Error updating ToDo");
      }
    } catch (error) {
      console.error("Error updating ToDo:", error);
    }
  };

  // Delete ToDo (DELETE)
  const deleteTodo = async (id: number) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("User is not logged in.");
        return;
      }

      const response = await fetch(`/api/ToDoList/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        onAction(); // Refresh data in parent
      } else {
        console.error("Error deleting ToDo");
      }
    } catch (error) {
      console.error("Error deleting ToDo:", error);
    }
  };

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
                  Save
                </Button>
                <Button
                  variant="text"
                  onClick={() => setEditingId(null)}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
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
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => deleteTodo(todo.id)}
                      style={{ marginLeft: 8 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        ))
      ) : (
        <Typography>No ToDos</Typography>
      )}
    </Box>
  );
};

export default ToDoList;
