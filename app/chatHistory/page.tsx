"use client";

import { useRouter } from "next/navigation";
import ToDoInput from "@/components/elements/todoInput/todoInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box, Button, Typography } from "@mui/material";
import SideBar from "@/components/layouts/sideBar/sideBar";
import { useEffect, useState } from "react";
import { History } from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";

interface ChatHistoryItem {
  id: number;
  period: string;
  prompt: string;
  response: string;
}


export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  // 初回レンダリング時にチャット履歴を取得
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          alert("ログインが必要です。");
          return;
        }

        const res = await fetch("/api/chatHistory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch chat history");

        const data = await res.json();
        setChatHistory(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

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

        {/* アプリ情報 */}
        <Box sx={{ flex: 4 }}>
          <TopBar />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}
            >
              Chat History
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ justifyContent: "center" }}
              onClick={() => handleNavigation("/aichat")}
            >
              <History style={{ marginRight: 8 }} />
              AI Chat
            </Button>
          </Box>
          {/* チャット履歴の表示 */}
          <Box sx={{ margin: 2 }}>
            {chatHistory.length > 0 ? (
              chatHistory.slice(0, 30).map(
                (
                  chat // 例えば10件まで表示
                ) => (
                  <Box
                    key={chat.id}
                    sx={{
                      marginBottom: 2,
                      padding: 2,
                      border: "1px solid #ccc",
                      borderRadius: 4,
                    }}
                  >
                    <Typography variant="h6">Prompt: {chat.prompt}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Response: {chat.response}
                    </Typography>
                  </Box>
                )
              )
            ) : (
              <Typography variant="body1">チャット履歴はありません</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
