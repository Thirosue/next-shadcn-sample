import { db } from "@/db"
import { rolePermissions, users } from "@/db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { and, eq } from "drizzle-orm"
import { getServerSession as originalGetServerSession } from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { SignInErrors } from "@/lib/constants"

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any,
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "test@test.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("authorize", credentials)
        const result = await db
          .select()
          .from(users)
          .where(and(eq(users.email, credentials!.username)))
          // .where(and(eq(users.email, credentials!.username), eq(users.password, credentials!.password)))
          .leftJoin(rolePermissions, eq(users.role, rolePermissions.roleName))
        if (result.length) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const user = result[0].user
          const permissions = result.map(({ rolePermission }) => ({
            pathname: rolePermission?.pathname,
            permission: rolePermission?.permission,
          }))
          return {
            ...user,
            permissions,
          }
        } else {
          throw new Error(SignInErrors.UserNotFoundException.code)
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
    jwt: ({ token, user }) => {
      console.log("callback jwt", token, user)
      if (user) {
        return {
          ...token,
          ...user,
          id: user.id,
        }
      }
      return token
    },
  },
}

export const getServerSession = async () => {
  return originalGetServerSession(authOptions)
}
