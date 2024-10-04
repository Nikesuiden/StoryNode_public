"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, ChangeEvent } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { MeetingRoom } from "@mui/icons-material";
import prisma from '@/lib/prisma';

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignUp = async (): Promise<void> => {
    if (password != password2) {
      alert("パスワードが一致していません。");
      return;
    }

    // 既に同じメールアドレスを持つユーザーがデータベースに存在するか確認
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUserByEmail) {
      console.error("入力のメールアドレスはしでに登録されています。");
      return { error: "入力のメールアドレスはしでに登録されています。" };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("サインアップに失敗しました: " + error.message);
    } else {
      handleNavigation("/confirm_email");
    }
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleChangePassword2 = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword2(e.target.value);
  };

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
        <Box
          sx={{
            position: "absolute",
            m: 0.5,
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
          }}
          onClick={() => handleNavigation("/opening")}
        >
          <MeetingRoom sx={{ fontSize: 30 }} />
          <Typography sx={{ fontSize: 10 }}>もどる</Typography>
        </Box>
        <Typography variant="h4" gutterBottom>
          新規登録
        </Typography>
        <TextField
          fullWidth
          label="メールアドレス"
          variant="outlined"
          margin="normal"
          type="email"
          value={email}
          onChange={handleChangeEmail}
        />
        <TextField
          fullWidth
          label="パスワード"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={handleChangePassword}
        />
        <TextField
          fullWidth
          label="パスワード確認"
          variant="outlined"
          margin="normal"
          type="password"
          value={password2}
          onChange={handleChangePassword2}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          sx={{ marginTop: 2 }}
        >
          サインアップ
        </Button>
      </Box>
    </Box>
  );
}
