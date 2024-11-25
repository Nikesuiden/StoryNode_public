"use client";

import AiChatForm from "@/components/elements/aiChatForm/aiChatForm";
import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";
import { Box, Typography } from "@mui/material";


export default function Aichat() {
  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography style={{ flexGrow: 1, fontSize: 25, fontWeight: "550" }}>
          AI Chat
        </Typography>
        <ChatHistory />
      </Box>
      <AiChatForm />
    </MainLayout>
  );
}
