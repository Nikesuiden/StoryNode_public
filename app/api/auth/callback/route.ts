// app/auth/callback/route.ts

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
// サーバーサイド認証の手順に基づいて作成したクライアントをインポート

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // パラメータに "next" があれば、それをリダイレクトURLとして使用
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // ロードバランサーの前の元のホスト名（オリジナルのオリジン）
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // ロードバランサーがないことが確実なため、X-Forwarded-Host を確認する必要がない
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // ユーザーをエラーページにリダイレクトし、指示を表示
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
