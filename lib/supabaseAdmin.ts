// lib/supabaseAdmin.ts

import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseのURLとサービスロールキーを取得
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Supabase Adminクライアントを作成
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  // 管理者クライアント用のオプションがあればここに追加
});

export { supabaseAdmin };
