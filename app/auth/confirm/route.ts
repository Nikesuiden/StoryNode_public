import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // ユーザーを指定されたリダイレクトURLまたはアプリのルートにリダイレクト
      redirect(next)
    }
  }

  // ユーザーをエラーページにリダイレクトし、いくつかの指示を表示
  redirect('/error')
}