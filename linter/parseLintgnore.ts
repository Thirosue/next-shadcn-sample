import fs from "fs"
import { Project } from "ts-morph"

// TypeScriptプロジェクトを作成
const project = new Project({
  tsConfigFilePath: "tsconfig.json",
})

export function parseLintgnore(): Set<string> {
  const lintgnorePath = project.addSourceFileAtPath(
    "src/lib/actions/.lintgnore"
  )
  const ignoredFiles = fs
    .readFileSync(lintgnorePath.getFilePath(), "utf-8")
    .split("\n")
    .filter(Boolean)
  return new Set(ignoredFiles)
}
