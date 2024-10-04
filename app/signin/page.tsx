"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Box, Typography, TextField } from "@mui/material";
import { MeetingRoom } from "@mui/icons-material";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "@/lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
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
          ログイン
        </Typography>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
        {/* <TextField
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
        </Button> */}
      </Box>
    </Box>
  );
}
