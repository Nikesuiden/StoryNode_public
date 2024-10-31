import { Box, CircularProgress } from "@mui/material";
import SideBar from "../sideBar/sideBar";
import BottomBar from "../bottomBar/bottomBar";
import { ReactNode, useState, useEffect } from "react";
import TopBar from "../topBar/topBar"; // Supabaseクライアントのインポート
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createServerSupabaseClient } from "@/utils/supabase/server";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const router = useRouter();

  // ユーザー情報を取得する関数
  const fetchUser = async () => {
    const supabase = await createServerSupabaseClient();
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      setUser(data?.user ?? null);

      if (!data) {
        setIsRedirecting(true); // リダイレクト開始
        router.replace("/opening"); // リダイレクト先のページパス
      }
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      setIsRedirecting(true); // エラー時もリダイレクト開始
      router.replace("/opening"); // エラー時もリダイレクト
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Box>
      {/* 認証中またはリダイレクト中の場合はローディングインジケーターを表示 */}
      {isAuthLoading || isRedirecting ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // ローディング画面を中央に配置
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
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
            <BottomBar user={user} />
          </Box>

          {/* PCレスポンシブ */}
          <Box
            sx={{
              "@media screen and (max-width:700px)": {
                display: "none",
              },
            }}
          >
            <SideBar user={user} />
          </Box>

          {/* アプリ情報 */}
          <Box sx={{ flex: 4 }}>
            <TopBar user={user} />
            {children}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MainLayout;
