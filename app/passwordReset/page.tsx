// PasswordReset.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function PasswordReset() {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://your-domain.com/update-password",
    });
    if (error) {
      console.error("パスワードリセット中にエラーが発生しました:", error.message);
    } else {
      console.log("パスワードリセットメールを送信しました");
    }
  };

  return (
    <div>
      <h1>パスワードリセット</h1>
      <input
        type="email"
        placeholder="メールアドレスを入力"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handlePasswordReset}>リセットメールを送信</button>
    </div>
  );
}
