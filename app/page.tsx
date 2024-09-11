"use client";

import DiaryInput from "@/components/elements/diaryInput/diaryInput";
import DiaryList from "@/components/elements/diaryList/diaryList";
import TimeDisplay from "@/components/elements/timeDisplay/timeDisplay";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import SideBar from "@/components/layouts/sideBar/sideBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const Index: React.FC = () => {
  const [diaryData, setDiaryData] = useState(null); // 保存された日記をリストを親で保持。

  // 日記情報を更新するAPIを実行
  const fetchDiaryPosts = async () => {
    try {
      const response = await fetch("/api/diaryPost", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json(); // データを子コンポーネントに送信しなきゃいけない
        setDiaryData(data);
        console.log('下品だなそうに決まってる')
        console.log("リストの更新が完了しました");
      } else {
        console.error("Failed to fetch diary posts");
      }
    } catch (error) {
      console.error("Error fetching diary posts:", error);
    }
  };

  // コンポーネントの初回レンダリング時に日記の一覧を取得
  useEffect(() => {
    fetchDiaryPosts();
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
          <TimeDisplay />
          <DiaryInput onAction={fetchDiaryPosts} />
          <hr />
          <DiaryList initialData={diaryData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
