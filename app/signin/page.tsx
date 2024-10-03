"use client";

import { useState, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button, Box, Typography, TextField } from '@mui/material';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignIn = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('サインインに失敗しました: ' + error.message);
    } else {
      alert('サインインに成功しました。');
      router.push('/'); // サインイン後のリダイレクト先
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
          サインイン
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
          onClick={handleSignIn}
          sx={{ marginTop: 2 }}
        >
          サインイン
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={() => handleNavigation("/passwordReset")}
          sx={{ marginTop: 1 }}
        >
          パスワードをリセットする
        </Button>
      </Box>
    </Box>
  );
};
