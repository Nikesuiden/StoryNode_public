"use client";

import DiaryInput from "@/components/elements/diaryInput/diaryInput";
import DiaryList from "@/components/elements/diaryList/diaryList";
import TimeDisplay from "@/components/elements/timeDisplay/timeDisplay";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";
import SideBar from "@/components/layouts/sideBar/sideBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { createClient } from "@/utils/supabase/client";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Index: React.FC = async () => {
  const [diaryData, setDiaryData] = useState(null); // 保存された日記をリストを親で保持。
  const [isLoading, setIsLoading] = useState<boolean>(true); // 初期ローディングを感知する機能

  // ページ遷移機能
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const supabase = await createClient();

  const fetchDiaryPosts = useCallback(async () => {
    setIsLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return;
    }

    const response = await fetch("/api/diaryPost", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`, // JWTトークンをヘッダーに追加
      },
    });

    if (response.ok) {
      const diaryPostsData = await response.json();
      setDiaryData(diaryPostsData);
      setIsLoading(false);
    } else {
      alert("情報の取得に失敗しました。タイトル画面に戻ります。");
      handleNavigation("/signin");
    }
  }, [handleNavigation]); // 必要な依存関係を追加

  useEffect(() => {
    fetchDiaryPosts();
  }, []); // fetchDiaryPostsを依存配列に追加

  return (
    <MainLayout>
      <TimeDisplay />
      <DiaryInput onAction={fetchDiaryPosts} />
      <hr />
      <DiaryList initialData={{ data: diaryData, isLoading }} />
    </MainLayout>
  );
};

export default Index;
