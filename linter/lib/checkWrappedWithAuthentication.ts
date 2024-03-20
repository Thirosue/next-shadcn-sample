import { SourceFile, SyntaxKind } from "ts-morph"

function isWrappedWithAuthentication(node: any): boolean {
  // ノードが関数呼び出しであるかチェック
  if (node.getKind() === SyntaxKind.CallExpression) {
    const callExpression = node as any

    // 関数名を取得
    const expression = callExpression.getExpression()
    if (expression.getText() === "withAuthentication") {
      // `withAuthentication`に渡された最初の引数を取得
      const args = callExpression.getArguments()
      if (args.length > 0) {
        const firstArg = args[0]
        // 引数が関数リテラル（FunctionExpressionまたはArrowFunction）または関数の識別子（Identifier）であるかチェック
        return (
          firstArg.getKind() === SyntaxKind.FunctionExpression ||
          firstArg.getKind() === SyntaxKind.ArrowFunction ||
          firstArg.getKind() === SyntaxKind.Identifier
        )
      }
    }
  }

  return false
}

// すべてのexportされた関数がwithAuthenticationでラップされているかチェック
export default function checkWrappedWithAuthentication(
  sourceFile: SourceFile
): boolean {
  const exportedDeclarations = sourceFile.getExportedDeclarations()

  for (const declarations of exportedDeclarations.values() as any) {
    for (const declaration of declarations) {
      // 変数宣言でない場合はNG
      if (declaration.getKind() !== SyntaxKind.VariableDeclaration) {
        return false
      }

      const initializer = declaration
        .asKindOrThrow(SyntaxKind.VariableDeclaration)
        .getInitializer()

      if (!initializer) {
        return false // 初期化子がない場合はNG
      }

      // 高階関数でラップされた関数でない場合はNG
      if (!isWrappedWithAuthentication(initializer)) {
        return false
      }
    }
  }

  return true
}
