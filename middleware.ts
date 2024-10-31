import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 次のパスで始まるリクエストパスを除いて、すべてのリクエストパスにマッチします:
     * - _next/static（静的ファイル）
     * - _next/image（画像最適化ファイル）
     * - favicon.ico（ファビコンファイル）
     * このパターンに他のパスを含める場合は、自由に修正してください。
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
