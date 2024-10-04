import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// メール＆パスワードによるサインアップ
async function signUpWithEmail(email: string, password: string): Promise<void> {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
  } else if (data && data.user) {
    console.log("User signed up:", data.user);
  }
}

// Google OAuthによるログイン
async function signInWithGoogle(): Promise<void> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Error logging in with Google:", error.message);
  } else if (data && data.url) {
    // Google認証プロバイダーにリダイレクト
    window.location.href = data.url;
  }
}

export default supabase
