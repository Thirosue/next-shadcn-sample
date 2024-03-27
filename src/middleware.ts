import { NextResponse } from "next/server"
import type { ScreenPermissions } from "@/types"
import { withAuth } from "next-auth/middleware"

import { redirects } from "@/lib/constants"
import { logMessage } from "@/lib/logger"
import { checkScreenPermissions } from "@/lib/utils"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    logMessage({ message: "custom middleware", object: req.nextauth.token })
    const currentPath = req.nextUrl.pathname
    const url = new URL(req.nextUrl.origin)

    const permissions = req.nextauth.token?.permissions as ScreenPermissions
    const isPermitted = checkScreenPermissions(permissions, currentPath)
    if (isPermitted) {
      return NextResponse.next()
    }

    // Redirect to dashboard if the user is already signed in and tries to access the sign-in page
    if (currentPath === redirects.toDashboard && req.nextauth.token?.baseUrl) {
      url.pathname = req.nextauth.token?.baseUrl as string
      return NextResponse.redirect(url)
    }

    url.pathname = "/404"
    return NextResponse.redirect(url)
  },
  {
    pages: {
      signIn: "/signin",
      error: "/error",
    },
  }
)

export const config = {
  matcher: ["/((?!api|trpc|sign*|404|_next).*)"],
}
