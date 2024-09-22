import { supabase } from "@/lib/supabaseClient";
import { Flex } from "@chakra-ui/react";
import { Box, Typography } from "@mui/material";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const TpoBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 現在のユーザーセッションを取得する関数
    const fetchUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("ユーザー取得エラー:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

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
    <Box sx={{ mb: 2 }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: 'flex-end',
          paddingTop: 10,
          paddingBottom: 12,
        }}
      >
        <Typography style={{ fontSize: 30, fontWeight: "550" }}>
          StoryNode
        </Typography>

        <Typography style={{ fontSize: 15 }}>
          {loading
            ? "読み込み中..."
            : user
            ? `${user.email}`
            : "ログインしていません"}
        </Typography>
      </Box>
      <hr />
    </Box>
  );
};

export default TpoBar;
