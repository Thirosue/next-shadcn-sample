import { SourceFile } from "ts-morph"

// exportされない関数が{namespace}_{action}形式であるかチェック
export default function checkNonExportedFunctionFormat(
  sourceFile: SourceFile
): boolean {
  const functions = sourceFile.getFunctions()
  let isValid = true // フォーマットが正しいかどうかを保持する変数

  for (const func of functions) {
    if (!func.isExported()) {
      const name = func.getName()
      if (name && !/^[\w]+_[\w]+$/.test(name)) {
        isValid = false // フォーマットに合致しない場合は、isValidをfalseに設定
      }
    }
  }

  return isValid // 全ての関数をチェックした後に結果を返す
}
