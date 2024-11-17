import { Box, CircularProgress } from "@mui/material";
import SideBar from "../sideBar/sideBar";
import BottomBar from "../bottomBar/bottomBar";
import React, { ReactNode, useState, useEffect, isValidElement, cloneElement } from "react";
import TopBar from "../topBar/topBar"; // Supabaseクライアントのインポート
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import DeleteUser from "@/components/elements/deleteUser/deleteUser";
import { User } from "@supabase/supabase-js";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>("");

  const router = useRouter();

  // ユーザー情報を取得する関数
  const fetchUser = async () => {
    if (user !== null) {
      return;
    }

    const supabase = await createClient();
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      setUser(data?.user ?? null);
      setUserId(data.user.id ?? "");
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      setUser(null);
      setUserId("")
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 特定の子コンポーネントに props を追加
  const enhancedChildren = React.Children.map(children, (child) => {
    if (isValidElement(child) && child.type === DeleteUser) {
      return cloneElement(child as React.ReactElement<UserProps>, { UserProp: userId });
    }
    return child;
  });
  

  return (
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
        {enhancedChildren}
      </Box>
    </Box>
  );
};

export default MainLayout;
