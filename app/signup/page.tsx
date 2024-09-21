"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, ChangeEvent } from "react";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignUp = async (): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("サインアップに失敗しました: " + error.message);
    } else {
      alert("サインアップに成功しました。確認メールをチェックしてください。");
    }
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <h1>サインアップ</h1>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={handleChangeEmail}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={handleChangePassword}
      />
      <button onClick={handleSignUp}>サインアップ</button>
    </div>
  );
}
