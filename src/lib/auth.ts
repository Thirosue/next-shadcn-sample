import { db } from "@/db"
import { rolePermissions, roles, systemUser } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { getServerSession as originalGetServerSession } from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { SignInErrors } from "@/lib/constants"

export const authOptions: NextAuthOptions = {
  // Doesn't it work properly with CredentialsProvider
  // adapter: DrizzleAdapter(db) as any,
  // https://next-auth.js.org/providers/credentials
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
          .from(systemUser)
          .where(and(eq(systemUser.email, credentials!.username)))
          // .where(and(eq(users.email, credentials!.username), eq(users.password, credentials!.password)))
          .leftJoin(roles, eq(systemUser.role, roles.name))
          .leftJoin(
            rolePermissions,
            eq(systemUser.role, rolePermissions.roleName)
          )
        if (result.length) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const user = result[0].systemUser
          const permissions = result.map(({ rolePermission }) => ({
            ...rolePermission,
          }))
          return {
            ...user,
            baseUrl: result[0].role!.baseUrl,
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
    jwt: ({ token, user }) => {
      console.log("callback jwt", token)
      if (user) {
        return {
          ...token,
          ...user,
          id: user.id,
        }
      }
      return token
    },
    session: ({ session, token }) => {
      console.log("callback session", token)
      return {
        ...session,
        user: {
          ...token,
          ...session.user,
          id: token.id,
        },
      }
    },
  },
}

export const getServerSession = async () => {
  return originalGetServerSession(authOptions)
}
