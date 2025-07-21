import eslint from './eslint'
import stylelint from './stylelint'
import markdownlint from './markdownlint'

import { Linter, type LinterInterface } from '@Types/lint'

const linters: Record<Linter, LinterInterface> = {
  [Linter.ESLint]: eslint,
  [Linter.Markdownlint]: markdownlint,
  [Linter.Stylelint]: stylelint,
}

export default linters
