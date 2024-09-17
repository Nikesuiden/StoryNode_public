"use client";

import ToDoInput from "@/components/elements/todoInput/todoInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box, Typography } from "@mui/material";
import SideBar from "@/components/layouts/sideBar/sideBar";
import React, { useEffect, useState } from "react";
import ToDoList from "@/components/elements/todoList/todoList";

interface ToDo {
  id: number;
  todo: string;
  chatId?: number | null;
}

const ToDo: React.FC = () => {
  const [todoData, setToDoData] = useState<ToDo[] | null>(null); // TODOデータを型定義

  const fetchToDoList = async () => {
    try {
      const res = await fetch("/api/ToDoList");
      if (!res.ok) {
        throw new Error("Failed to fetch ToDo list");
      }
      const data = await res.json();
      setToDoData(data);
    } catch (error) {
      console.error("ToDoの取得中にエラーが発生しました:", error);
    }
  };

  // ToDoリストを取得（GET）
  useEffect(() => {
    fetchToDoList();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          margin: 2,
          "@media screen and (min-width:700px)": {
            display: "flex",
          },
          "@media screen and (max-width:700px)": {
            paddingBottom: "60px",
          },
        }}
      >
        {/* スマホレスポンシブ */}
        <Box
          sx={{
            "@media screen and (min-width:700px)": {
              display: "none",
            },
          }}
        >
          <BottomBar />
        </Box>

        {/* PCレスポンシブ */}
        <Box
          sx={{
            "@media screen and (max-width:700px)": {
              display: "none",
            },
          }}
        >
          <SideBar />
        </Box>

        {/* アプリ情報情報 */}
        <Box sx={{ flex: 4 }}>
          <TopBar />
          <Typography style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}>
            ToDoList
          </Typography>

          <ToDoInput onAction={fetchToDoList} />
          <ToDoList initialData={todoData} />
        </Box>
      </Box>
    </Box>
  );
};

export default ToDo;
