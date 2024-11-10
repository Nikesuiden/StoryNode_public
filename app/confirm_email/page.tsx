"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Box, Typography, TextField } from "@mui/material";
import { MeetingRoom } from "@mui/icons-material";
import Image from "next/image";

export default function SignIn() {

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5", // 背景色
        padding: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white", // フォームの背景
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Image
          src="/airplane/airplane.png"
          width={400}
          height={400}
          alt="飛行機の画像"
          priority={true}
        />
        <Typography sx={{ mt: 2 }}>確認メールを送信しました！ご確認ください</Typography>
      </Box>
    </Box>
  );
}
