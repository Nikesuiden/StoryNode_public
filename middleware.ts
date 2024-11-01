import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // ↓middleware では cookie 参照の API が違うので先ほどのコードは使えない.
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // ↓middleware では cookie 参照の API が違うので先ほどのコードは使えない.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  // Redirect to /signin page.
  if (user.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|signin|opening|signup||.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
