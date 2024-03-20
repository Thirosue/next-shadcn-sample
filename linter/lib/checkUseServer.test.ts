import { Project, SourceFile } from "ts-morph"

import checkUseServer from "./checkUseServer"

describe("checkUseServer", () => {
  let project: Project

  beforeAll(() => {
    project = new Project()
  })

  const testCases: [string, string, boolean][] = [
    ['"use server" at the top', '"use server";\n\nfunction test() {}', true],
    [
      '"use server" with new line at the top',
      '"use server"\n\nfunction test() {}',
      true,
    ],
    ['Without "use server"', "function test() {}", false],
  ]

  test.each(testCases)(
    "%s: given %s should return %s",
    (name, content, expected) => {
      const sourceFile: SourceFile = project.createSourceFile(
        "temp/test.ts",
        content,
        { overwrite: true }
      )
      const result = checkUseServer(sourceFile)
      expect(result).toBe(expected)
      project.removeSourceFile(sourceFile)
    }
  )
})
