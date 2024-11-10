// app/todo/page.tsx

"use client";

import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box, Typography } from "@mui/material";
import SideBar from "@/components/layouts/sideBar/sideBar";
import React, { useEffect, useState } from "react";
import ToDoList from "@/components/elements/todoList/todoList";
import ToDoInput from "@/components/elements/todoInput/todoInput";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";
import { createClient } from "@/utils/supabase/client";

interface ToDo {
  id: number;
  todo: string;
}

const ToDoPage: React.FC = () => {
  const [todoData, setToDoData] = useState<ToDo[] | null>(null);

  const fetchToDoList = async () => {
    const supabase = await createClient();
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("ユーザーが認証されていません");
      }

      const res = await fetch("/api/ToDoList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("情報の取得に失敗しました");
      }

      const data = await res.json();
      setToDoData(data);
      console.log("情報の取得に成功しました。");
    } catch (error) {
      console.error("ToDoの取得中にエラーが発生しました:", error);
    }
  };

  useEffect(() => {
    fetchToDoList();
  }, []);

  return (
    <MainLayout>
      <Typography style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}>
        ToDoList
      </Typography>

      <ToDoInput onAction={fetchToDoList} />
      <ToDoList initialData={todoData} onAction={fetchToDoList} />
    </MainLayout>
  );
};

export default ToDoPage;
