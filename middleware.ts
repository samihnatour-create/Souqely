import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  // 1. SUPABASE SESSION HANDLER (Keep exactly as is)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const url = request.nextUrl;
  const path = url.pathname;
  const hostname = request.headers.get("host");

  // 2. AUTH & VERIFICATION GUARDS (Keep your existing logic)
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/settings");

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("id", user.id)
      .single();

    if (profile && !profile.is_verified && path !== "/auth/verify") {
      return NextResponse.redirect(new URL("/auth/verify", request.url));
    }
  }

  // 3. SUBDOMAIN REWRITER (Fix)
  const rootDomain = process.env.NODE_ENV === "production" ? "souqely.com" : "localhost:3000";
  const subdomain = hostname?.replace(`.${rootDomain}`, "");

  if (subdomain && subdomain !== rootDomain && subdomain !== "www") {
    // 1. Clone the current URL so we keep all query params (?method=whish, etc.)
    const url = request.nextUrl.clone();

    // 2. Update the pathname to point to the internal folder
    const currentPath = path === "/" ? "" : path;
    url.pathname = `/store/${subdomain}${currentPath}`;

    // 3. Rewrite using this new URL (which still has the search params attached)
    return NextResponse.rewrite(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};