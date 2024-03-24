import { Project, SourceFile } from "ts-morph"

import checkWrappedWithAuthentication from "./checkWrappedWithAuthentication"

describe("checkWrappedWithAuthentication", () => {
  let project: Project

  beforeAll(() => {
    project = new Project()
  })

  const testCases: [string, string, boolean][] = [
    [
      "Single function wrapped",
      `
      async function user_findAll() {}
      export const withAuth = withAuthentication(user_findAll)
      `,
      true,
    ],
    ["Single function not wrapped", "export function myFunc() {}", false],
    [
      "Multiple functions wrapped",
      `export const withAuth user_upsert() {}`,
      false,
    ],
    [
      "One wrapped and one not",
      `
      async function user_findAll() {}
      async function user_upsert() {}
      export const withAuth = withAuthentication(user_findAll)
      export const withAuth2 = user_upsert
      `,
      false,
    ],
    [
      "Function with different wrapper",
      `
      async function user_findAll() {}
      export const withAuth = otherWrapper(user_findAll)
      `,
      false,
    ],
  ]

  test.each(testCases)(
    "%s: given %s should return %s",
    (name, content, expected) => {
      const sourceFile: SourceFile = project.createSourceFile(
        "test.ts",
        content,
        { overwrite: true }
      )
      const result = checkWrappedWithAuthentication(sourceFile)
      expect(result).toBe(expected)
      project.removeSourceFile(sourceFile)
    }
  )
})
