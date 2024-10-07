"use client";

import DiaryInput from "@/components/elements/diaryInput/diaryInput";
import DiaryList from "@/components/elements/diaryList/diaryList";
import TimeDisplay from "@/components/elements/timeDisplay/timeDisplay";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import SideBar from "@/components/layouts/sideBar/sideBar";
import TopBar from "@/components/layouts/topBar/topBar";
import supabase from "@/lib/supabaseClient";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Index: React.FC = () => {
  const [diaryData, setDiaryData] = useState(null); // 保存された日記をリストを親で保持。
  const [isLoading, setIsLoading] = useState<boolean>(true); // 初期ローディングを感知する機能

  // ページ遷移機能
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

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
}, [supabase, handleNavigation]);  // 必要な依存関係を追加

useEffect(() => {
  fetchDiaryPosts();
}, []);  // fetchDiaryPostsを依存配列に追加


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
          <TimeDisplay />
          <DiaryInput onAction={fetchDiaryPosts} />
          <hr />
          <DiaryList initialData={{ data: diaryData, isLoading }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
