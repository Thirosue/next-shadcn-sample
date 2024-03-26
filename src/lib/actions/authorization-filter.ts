import { use } from "react"
import { AuthUser } from "@/types"

import { getServerSession } from "@/lib/auth"

import { verifyCsrfTokens } from "./token"

function extractNamespaceAndOperation(functionName: string) {
  const match = functionName.match(/^(.*?)_(.*)$/)
  if (!match) {
    throw new Error("Invalid function name")
  }
  return { namespace: match[1], operation: match[2] }
}

function authorization(user: AuthUser, functionName: string) {
  const { namespace, operation } = extractNamespaceAndOperation(functionName)

  const permissionEntry = user.permissions
    .filter(({ type }) => type === "actions")
    .find(
      (entry) =>
        new RegExp(entry.namespace!).test(namespace) &&
        new RegExp(entry.operation!).test(operation)
    )

  console.log(user, namespace, operation)
  return !permissionEntry
}

export function withAuthentication(fn: Function) {
  return async function (...args: any[]) {
    const session = await getServerSession()
    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const functionName = fn.name
    if (authorization(session.user as AuthUser, functionName)) {
      throw new Error("Unauthorized")
    }
    console.log(`🔐 ${functionName} is authenticated`)

    const { namespace, operation } = extractNamespaceAndOperation(functionName)
    if (["insert", "update", "upsert", "delete"].includes(operation)) {
      const token = args[0].token
      console.log(`🆕 ${operation} ${namespace}, token: ${token}`)
      const isVerified = await verifyCsrfTokens(token)
      if (!isVerified) {
        throw new Error("CSRF token is invalid")
      }
      console.log(`🔑 ${operation} ${namespace} is verified`)
    }

    // 元の関数を実行
    return await fn(...args)
  }
}
