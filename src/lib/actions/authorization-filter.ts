import { AuthUser } from "@/types"

import { getServerSession } from "@/lib/auth"
import { logMessage } from "@/lib/logger"

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

  logMessage({
    message: `Authorization: ${user.id} ${namespace} ${operation}`,
  })
  return !permissionEntry
}

export function withAuthentication(fn: Function) {
  return async function (...args: any[]) {
    const session = await getServerSession()
    if (!session?.user) {
      return {
        status: 401,
        message: "Unauthorized",
      }
    }

    const functionName = fn.name
    if (authorization(session.user as AuthUser, functionName)) {
      return {
        status: 403,
        message: "Forbidden",
      }
    }
    logMessage({ message: `🔐 ${functionName} is authenticated` })

    const { namespace, operation } = extractNamespaceAndOperation(functionName)
    if (["insert", "update", "upsert", "delete"].includes(operation)) {
      const token = args[0].token
      logMessage({ message: `🆕 ${operation} ${namespace}, token: ${token}` })
      const isVerified = await verifyCsrfTokens(token)
      if (!isVerified) {
        return {
          status: 403,
          message: "CSRF token is invalid",
        }
      }
      logMessage({ message: `🔑 ${operation} ${namespace} is verified` })
    }

    // 元の関数を実行
    return await fn(...args)
  }
}
