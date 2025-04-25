import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
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
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Homepage routes protection
    if (request.nextUrl.pathname === "/write-blog" && error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/reset-password" && error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Profile redirection logic
    if (request.nextUrl.pathname.startsWith("/profile/")) {
      // Extract the id from the path
      const id = request.nextUrl.pathname.split("/")[2];

      // If user is logged in and trying to access their own profile
      if (user && user.id === id) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }

      // Optional: If user is not logged in, redirect to sign-in
      if (!user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return response;
  } catch (e) {
    console.error("Error in updateSession middleware:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
