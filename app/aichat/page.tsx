"use client";

import AiChatForm from "@/components/elements/aiChatForm/aiChatForm";
import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import SideBar from "@/components/layouts/sideBar/sideBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { textDecoration } from "@chakra-ui/react";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function Aichat() {
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
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography
              style={{ flexGrow: 1, fontSize: 25, fontWeight: "550" }}
            >
              AI Chat
            </Typography>
            <ChatHistory />
          </Box>
          <AiChatForm />
        </Box>
      </Box>
    </Box>
  );
}
