// UpdatePassword.tsx
"use client";

import supabase from "@/lib/supabaseClient";
import { useState } from "react";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error("パスワード変更中にエラーが発生しました:", error.message);
    } else {
      console.log("パスワードを変更しました");
    }
  };

  return (
    <div>
      <h1>パスワード変更</h1>
      <input
        type="password"
        placeholder="新しいパスワードを入力"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleUpdatePassword}>パスワードを変更</button>
    </div>
  );
}
