import { Project } from "ts-morph"

import { runChecks } from "./check"
import { parseLintgnore } from "./parseLintgnore"

const ignoredFiles = parseLintgnore()
const project = new Project()

let hasError = false

process.argv.slice(2).forEach((file) => {
  if (!ignoredFiles.some((ignoredFile) => file.includes(ignoredFile))) {
    console.log(`Checking ${file}...`)
    const sourceFile = project.addSourceFileAtPath(file)
    const result = runChecks(sourceFile)
    console.log(`${file}: ${result}`)
    if (!result) {
      hasError = true
    }
  }
})

if (hasError) {
  process.exit(1)
}
