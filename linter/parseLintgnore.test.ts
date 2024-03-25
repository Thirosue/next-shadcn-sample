import fs from "fs"

import { parseLintgnore } from "./parseLintgnore"

describe("parseLintgnore", () => {
  test("should return a set of ignored files", () => {
    // Mock the behavior of fs.readFileSync
    jest.spyOn(fs, "readFileSync").mockReturnValue(`
file1.ts
file2.ts
file3.ts
`)

    const result = parseLintgnore()

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)
    expect(result.includes("file1.ts")).toBe(true)
    expect(result.includes("file2.ts")).toBe(true)
    expect(result.includes("file3.ts")).toBe(true)
  })
})
