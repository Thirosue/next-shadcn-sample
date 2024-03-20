import { SourceFile, SyntaxKind } from "ts-morph"

// "use server"がファイルの先頭に存在するかチェック
export default function useServerCheck(sourceFile: SourceFile): boolean {
  const firstStatement = sourceFile.getStatements()[0]
  return (
    firstStatement &&
    firstStatement.getKind() === SyntaxKind.ExpressionStatement &&
    firstStatement.getText().includes('"use server"')
  )
}
