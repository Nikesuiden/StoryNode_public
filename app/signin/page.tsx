"use client";

import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { MeetingRoom } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import SignInWithGoogle from "@/components/elements/signinWithGoogle/signinWithGoogle";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export default function SignIn() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    const supabase = await createServerSupabaseClient();
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

  const handleSignup = async () => {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("サインアップ成功！");
    }
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
          ログイン
        </Typography>

        <form onSubmit={(e) => e.preventDefault()} style={{ width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            sx={{ mt: 2 }}
          >
            Log in
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSignup}
            fullWidth
            sx={{ mt: 1 }}
          >
            Sign up
          </Button>
        </form>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: 2,
          }}
        >
          <SignInWithGoogle />
        </Box>
      </Box>
    </Box>
  );
}
