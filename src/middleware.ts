import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log("custom middleware")
    console.log(req.nextauth.token)
    const { pathname } = req.nextUrl
    const url = new URL(req.nextUrl.origin)

    const permissions = req.nextauth.token?.permissions as {
      pathname: string
      permission: string
    }[]
    const isPermitted = permissions.some(({ pathname, permission }) => {
      const regexp = new RegExp(pathname)
      return regexp.test(pathname) && permission?.includes("R")
    })
    if (!isPermitted) {
      url.pathname = "/404"
      return NextResponse.redirect(url)
    }
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
