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

    expect(result).toBeInstanceOf(Set)
    expect(result.size).toBe(3)
    expect(result.has("file1.ts")).toBe(true)
    expect(result.has("file2.ts")).toBe(true)
    expect(result.has("file3.ts")).toBe(true)
  })
})
