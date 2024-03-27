import { Project } from "ts-morph"

import { logMessage } from "@/lib/logger"

import { runChecks } from "./check"
import { parseLintgnore } from "./parseLintgnore"

const ignoredFiles = parseLintgnore()
const project = new Project()

let hasError = false

process.argv.slice(2).forEach((file) => {
  if (!ignoredFiles.some((ignoredFile) => file.includes(ignoredFile))) {
    logMessage({ message: `Checking ${file}...` })
    const sourceFile = project.addSourceFileAtPath(file)
    const result = runChecks(sourceFile)
    logMessage({ message: `${file}: ${result}` })
    if (!result) {
      hasError = true
    }
  }
})

if (hasError) {
  process.exit(1)
}
