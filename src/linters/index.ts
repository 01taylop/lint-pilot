import eslint from './eslint'
import stylelint from './stylelint'
import markdownlint from './markdownlint'

import { Linter, type LintReport } from '@Types'

type Linters = {
  [key in Linter]: {
    lintFiles: (files: Array<string>) => Promise<LintReport>
  }
}

const linters: Linters = {
  [Linter.ESLint]: eslint,
  [Linter.Markdownlint]: markdownlint,
  [Linter.Stylelint]: stylelint,
}

export default linters
