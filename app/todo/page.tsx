"use client";

import ToDoInput from "@/components/elements/todoInput/todoInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box, Typography } from "@mui/material";
import SideBar from "@/components/layouts/sideBar/sideBar";
import React, { useEffect, useState } from "react";
import ToDoList from "@/components/elements/todoList/todoList";
import { supabase } from "@/lib/supabaseClient";

interface ToDo {
  id: number;
  todo: string;
  chatId?: number | null;
}

const ToDo: React.FC = () => {
  const [todoData, setToDoData] = useState<ToDo[] | null>(null); // TODOデータを型定義

  const fetchToDoList = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession(); // Supabaseからセッションを取得

      if (!session?.access_token) {
        throw new Error("ユーザーが認証されていません");
      }

      const res = await fetch("/api/ToDoList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // JWTトークンをヘッダーに追加
        },
      });

      if (!res.ok) {
        throw new Error("ToDoリストの取得に失敗しました");
      }

      const data = await res.json();
      setToDoData(data); // 取得したデータをステートに保存
    } catch (error) {
      console.error("ToDoの取得中にエラーが発生しました:", error);
    } 
  };

  // コンポーネントのマウント時にToDoリストを取得
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
