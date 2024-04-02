export const unknownError = "An unknown error occurred. Please try again later."

export const redirects = {
  toTop: "/",
  toDashboard: "/dashboard/home",
  toLogin: "/signin",
  toSignup: "/signup",
  afterLogin: "/dashboard/stores",
  afterLogout: "/",
  toVerify: "/signup/verify-email",
  toPasswordResetConfirm: "/signin/reset-password/confirm",
  afterVerify: "/dashboard/stores",
} as const

export const dbPrefix = "myDb"

type Error = {
  code: string
  message: string
}

export const SignInErrors: Record<string, Error> = {
  UserNotFoundException: {
    code: "UserNotFoundException",
    message: "User not found",
  },
  NotAuthorizedException: {
    code: "NotAuthorizedException",
    message: "Incorrect username or password",
  },
}
