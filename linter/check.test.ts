import { Project, SourceFile } from "ts-morph"

import { runChecks } from "./check"

describe("runChecks", () => {
  let project: Project

  beforeAll(() => {
    project = new Project()
  })

  const testCases: [string, string, boolean][] = [
    [
      "All checks pass",
      `
"use server"

async function user_findAll() {}
async function user_upsert() {}

export const withAuth = withAuthentication(user_findAll)
export const withAuth2 = withAuthentication(user_upsert)
`,
      true,
    ],
    [
      "Mixed Correct and Incorrect",
      `
"use server"
async function user_findAll() {}
async function user_upsert() {}

export const withAuth = withAuthentication(user_findAll)
export const withAuth2 = user_upsert
`,
      false,
    ],
    [
      'Missing "use server"',
      `
async function user_findAll() {}
async function user_upsert() {}

export const withAuth = withAuthentication(user_findAll)
export const withAuth2 = withAuthentication(user_upsert)
`,
      false,
    ],
    [
      "Non-regular exported function",
      `
"use server"
    
export const myFunc = () => {}
`,
      false,
    ],
    [
      'Exported function without "WithAuth"',
      `
"use server"

async function user_findAll() {}
async function user_upsert() {}

export const withAuth = withAuthentication(user_findAll)
export const withAuth2 = withNotAuthentication(user_upsert)
`,
      false,
    ],
    [
      'Function not wrapped with "withAuthentication"',
      `
"use server"

export async function user_findAll() {}
`,
      false,
    ],
    [
      "Non-exported function format incorrect",
      `
"use server"

function incorrectFormat() {}

export async function withAuthentication(myNamespace_myAction)
`,
      false,
    ],
  ]

  test.each(testCases)(
    "%s: given %s should return %s",
    (name, content, expected) => {
      const sourceFile: SourceFile = project.createSourceFile(
        "temp/test.ts",
        content,
        { overwrite: true }
      )
      const result = runChecks(sourceFile)
      expect(result).toBe(expected)
      project.removeSourceFile(sourceFile)
    }
  )
})
