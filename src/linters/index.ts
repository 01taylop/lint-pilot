import eslint from './eslint'
import stylelint from './stylelint'
import markdownlint from './markdownlint'

import { Linter } from '@Types'

const linters = {
  [Linter.ESLint]: eslint,
  [Linter.Markdownlint]: markdownlint,
  [Linter.Stylelint]: stylelint,
}

export default linters
