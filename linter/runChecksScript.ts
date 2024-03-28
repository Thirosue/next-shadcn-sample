import { Project } from "ts-morph"

import { runChecks } from "./check"
import { parseLintgnore } from "./parseLintgnore"

const ignoredFiles = parseLintgnore()
const project = new Project()

const captains = console

let hasError = false

process.argv.slice(2).forEach((file) => {
  if (!ignoredFiles.some((ignoredFile) => file.includes(ignoredFile))) {
    captains.log(`Checking ${file}...`)
    const sourceFile = project.addSourceFileAtPath(file)
    const result = runChecks(sourceFile)
    captains.log(`${file}: ${result}`)
    if (!result) {
      hasError = true
    }
  }
})

if (hasError) {
  process.exit(1)
}
