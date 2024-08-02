import eslint from './eslint'
import stylelint from './stylelint'
import markdownlint from './markdownlint'

import { Linter, type LintFiles, type LintReport } from '@Types'

type Linters = {
  [key in Linter]: {
    lintFiles: (options: LintFiles) => Promise<LintReport>
  }
}

const linters: Linters = {
  [Linter.ESLint]: eslint,
  [Linter.Markdownlint]: markdownlint,
  [Linter.Stylelint]: stylelint,
}

export default linters
