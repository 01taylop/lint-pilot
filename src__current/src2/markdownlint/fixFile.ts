import { readFileSync, writeFileSync } from 'fs'

import { type LintError } from 'markdownlint'
import { applyFixes } from 'markdownlint-rule-helpers'

interface FixFile {
  errors: Array<LintError>
  file: string
}

const fixFile = ({ errors, file }: FixFile) => {
  const filePath = `${process.cwd()}/${file}`
  const fileContent = readFileSync(filePath, 'utf8')
  const fixedContent = applyFixes(fileContent, errors)

  writeFileSync(filePath, fixedContent)
}

export default fixFile
