// LogoutButton.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const handleLogout = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウト中にエラーが発生しました:", error.message);
    } else {
      console.log("ログアウトに成功しました");
      handleNavigation("/opening");
    }
  };

  return <Button onClick={handleLogout}>ログアウト</Button>;
}
