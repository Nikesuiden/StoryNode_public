"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, ChangeEvent } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter

  const handleSignUp = async (): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("サインアップに失敗しました: " + error.message);
    } else {
      alert("サインアップに成功しました。確認メールをチェックしてください。");
    }
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
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
