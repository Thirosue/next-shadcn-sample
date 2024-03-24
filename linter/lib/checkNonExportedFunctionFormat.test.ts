import { Project, SourceFile } from "ts-morph"

import checkNonExportedFunctionFormat from "./checkNonExportedFunctionFormat"

describe("checkNonExportedFunctionFormat", () => {
  let project: Project

  beforeAll(() => {
    project = new Project()
  })

  // テストケースに名称を含める
  const testCases: [string, string, boolean][] = [
    ["All Correct", "function myNamespace_myAction() {}", true],
    [
      "Mixed Correct and Incorrect",
      "function myNamespace_myAction() {}\nfunction another_Incorrect() {}",
      true,
    ],
    [
      "One Incorrect",
      "function myNamespace1_myAction1() {}\nfunction myNamespace2myAction2() {}",
      false,
    ],
    ["All Incorrect", "function incorrectFormat() {}", false],
  ]

  // テストケースの名称を含めてテストを記述
  test.each(testCases)(
    "%s: given %s should return %s",
    (name, content, expected) => {
      const sourceFile: SourceFile = project.createSourceFile(
        "test.ts",
        content,
        { overwrite: true }
      )
      const result = checkNonExportedFunctionFormat(sourceFile)
      expect(result).toBe(expected)
      project.removeSourceFile(sourceFile)
    }
  )
})
