import { Project, SourceFile } from "ts-morph"

import checkNonExportedFunctionFormat from "./lib/checkNonExportedFunctionFormat"
import checkUseServer from "./lib/checkUseServer"
import checkWrappedWithAuthentication from "./lib/checkWrappedWithAuthentication"

// TypeScriptプロジェクトを作成
const project = new Project({
  tsConfigFilePath: "tsconfig.json",
})

// チェックを実行し、結果を処理
export function runChecks(sourceFile: SourceFile): boolean {
  const useServerCheck = checkUseServer(sourceFile)
  if (!useServerCheck) {
    console.error('The file does not start with "use server"')
  }

  const wrappedWithAuthenticationCheck =
    checkWrappedWithAuthentication(sourceFile)
  if (!wrappedWithAuthenticationCheck) {
    console.error('No exported function is wrapped with "withAuthentication"')
  }

  const nonExportedFunctionFormatCheck =
    checkNonExportedFunctionFormat(sourceFile)
  if (!nonExportedFunctionFormatCheck) {
    console.error(
      'Non-exported function names must be in the format "{namespace}_{action}"'
    )
  }

  return (
    useServerCheck &&
    wrappedWithAuthenticationCheck &&
    nonExportedFunctionFormatCheck
  )
}
