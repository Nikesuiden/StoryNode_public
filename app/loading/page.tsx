"use client";

import supabase from "@/lib/supabaseClient";
import { Box, Typography } from "@mui/material";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FirstLoading() {
  const [user, setUser] = useState<User | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const fetchUser = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      setUser(session?.user ?? null);
      handleNavigation("/");
      if (!session) {
        router.replace("/opening"); // リダイレクト先のページパス
      }
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      setUser(null);
      router.replace("/opening"); // エラー時もリダイレクト
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // 認証状態の変更を監視するリスナーを設定
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // コンポーネントのアンマウント時にリスナーをクリーンアップ
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <Box sx={{backgroundColor: "white"}}>
      <Typography variant="h1" sx={{display: "none"}}>Loading...</Typography>
    </Box>
  );
}
