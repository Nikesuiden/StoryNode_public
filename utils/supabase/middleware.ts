import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 重要: createServerClient と supabase.auth.getUser() の間にロジックを追加しないでください。
  // 小さなミスでも、ユーザーがランダムにログアウトされる問題をデバッグするのが非常に困難になります。

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // ユーザーがいない場合、ユーザーをログインページにリダイレクトする可能性があるため応答します。
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // 重要: supabaseResponse オブジェクトをそのまま返す必要があります。
  // NextResponse.next() で新しいレスポンスオブジェクトを作成する場合は、以下の点に注意してください:
  // 1. このようにリクエストを渡します:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. クッキーをコピーします:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. myNewResponse オブジェクトをニーズに合わせて変更しますが、クッキーを変更しないでください！
  // 4. 最後に:
  //    return myNewResponse
  // これを行わないと、ブラウザとサーバーが同期しなくなり、ユーザーのセッションが早期に終了する原因となる可能性があります。

  return supabaseResponse
}
