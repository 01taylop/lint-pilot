import { Linter } from '@Types/lint'

import eslint from './eslint'
import markdownlint from './markdownlint'
import stylelint from './stylelint'

import type { LintFilesOptions, LintReport } from '@Types/lint'

type Linters = {
  [key in Linter]: {
    lintFiles: (options: LintFilesOptions) => Promise<LintReport>
  }
}

const linters: Linters = {
  [Linter.ESLint]: eslint,
  [Linter.Markdownlint]: markdownlint,
  [Linter.Stylelint]: stylelint,
}

export default linters
