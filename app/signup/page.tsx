"use client";

import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { MeetingRoom } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import SignUpWithGoogle from "@/components/elements/signUpWithGoogle/signUpWithGoogle";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export default async function SignUp() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const supabase = await createServerSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("ログイン成功！");
    }
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          position: "relative",
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
        {/* <TextField
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type="email"
          placeholder="パスワード"
          value={email}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>ログイン</Button> */}
        <Box
          sx={{
            display: "flex", // ここを追加
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center", // ここで水平方向の中央揃え
            width: "100%", // 幅を100%に設定
            marginTop: 2, // 適宜余白を追加
          }}
        >
          <SignUpWithGoogle />
        </Box>
      </Box>
    </Box>
  );
}
