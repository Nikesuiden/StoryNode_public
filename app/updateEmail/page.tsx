// UpdateEmail.tsx
"use client";

import supabase from "@/lib/supabaseClient";
import { useState } from "react";

export default function UpdateEmail() {
  const [email, setEmail] = useState("");

  const handleUpdateEmail = async () => {
    const { data, error } = await supabase.auth.updateUser({ email });
    if (error) {
      console.error("メールアドレス変更中にエラーが発生しました:", error.message);
    } else {
      console.log("メールアドレスを変更しました:", data);
    }
  };

  return (
    <div>
      <h1>メールアドレス変更</h1>
      <input
        type="email"
        placeholder="新しいメールアドレスを入力"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleUpdateEmail}>メールアドレスを変更</button>
    </div>
  );
}
