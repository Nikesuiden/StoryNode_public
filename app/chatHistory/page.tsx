"use client";

import { useRouter } from "next/navigation";
import ToDoInput from "@/components/elements/todoInput/todoInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import SideBar from "@/components/layouts/sideBar/sideBar";
import { useCallback, useEffect, useState } from "react";
import { History } from "@mui/icons-material";
import supabase from "@/lib/supabaseClient";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";

interface ChatHistoryItem {
  id: number;
  period: string;
  prompt: string;
  response: string;
}

export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 初回レンダリング時にチャット履歴を取得
  const fetchChatHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }, [supabase]); // supabaseに依存するため、依存配列に追加

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]); // fetchChatHistoryを依存配列に追加

  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}>
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
        {/* ローディング中の場合 */}
        {isLoading ? (
          <Box
            sx={{
              m: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : chatHistory.length > 0 ? (
          /* チャット履歴がある場合 */
          chatHistory.slice(0, 30).map(
            (
              chat // 例えば30件まで表示
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
          /* チャット履歴がない場合 */
          <Typography variant="body1">チャット履歴はありません</Typography>
        )}
      </Box>
    </MainLayout>
  );
}
