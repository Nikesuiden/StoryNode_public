// LogoutButton.tsx
"use client";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウト中にエラーが発生しました:", error.message);
    } else {
      console.log("ログアウトに成功しました");
      handleNavigation("/opening");
    }
  };

  return <button onClick={handleLogout}>ログアウト</button>;
}
