import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function pathIsIn(pathname: string, checkAgainst: MiddlewarePath[]) {
  return !!checkAgainst.find((path) => pathname.startsWith(path));
}

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });
  // Check if we have a session
  const { data } = await supabase.auth.getUser();

  if (pathIsIn(req.nextUrl.pathname, ["/login"])) {
    if (data.user) return NextResponse.redirect(new URL("/explore", req.url));
  }

  if (pathIsIn(req.nextUrl.pathname, ["/dashboard", "/create-prompt"])) {
    if (!data.user) return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

const matcher = ["/login", "/dashboard", "/create-prompt"] as const;
type MiddlewarePath = (typeof matcher)[number];

export const config = {
  matcher,
};
