"use client";

import AiChatForm from "@/components/elements/aiChatForm/aiChatForm";
import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";
import SideBar from "@/components/layouts/sideBar/sideBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { textDecoration } from "@chakra-ui/react";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

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
