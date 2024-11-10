// components/supabase-listener.tsx
"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SupabaseListenerProps {
  accessToken?: string;
}

export default function SupabaseListener({ accessToken }: SupabaseListenerProps) {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = createClient().auth.onAuthStateChange(
      (event, session) => {
        if (session?.access_token !== accessToken) {
          router.refresh();  // 認証状態が変わった場合にリフレッシュ
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();  // クリーンアップ
    };
  }, [accessToken, router]);

  return null;
}
