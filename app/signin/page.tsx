"use client";

import { useState, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignIn = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('サインインに失敗しました: ' + error.message);
    } else {
      alert('サインインに成功しました。');
      router.push('/'); // サインイン後のリダイレクト先
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
      <h1>サインイン</h1>
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
      <button onClick={handleSignIn}>サインイン</button>
      <Button onClick={() => handleNavigation("/passwordReset")}>
            パスワードをリセットする
          </Button>
    </div>
  );
}
