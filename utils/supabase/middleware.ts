// utils/supabase/middleware.ts

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Next.jsのレスポンスオブジェクトを作成
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Supabaseの機サーバー用のクライアントを作成
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Cookieの取得
        getAll() {
          const checkCookies = request.cookies.getAll();
          console.log("取得したクッキー", checkCookies);
          return request.cookies.getAll();
        },

        // Cookieの設定と削除に対応
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 重要: createServerClient と supabase.auth.getUser() の間にロジックを追加しないでください。
  // 小さなミスでも、ユーザーがランダムにログアウトされる問題をデバッグするのが非常に困難になります。

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("ユーザ認証がされていません。");
  }

  if (error) {
    console.log("getUserエラー :", error.message);
  }


  if (!user && !request.nextUrl.pathname.startsWith("/signin")) {
    // ユーザーがいない場合、ユーザーをログインページにリダイレクトする可能性があるため応答します。
    console.log("取得失敗");
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
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

  return supabaseResponse;
}
