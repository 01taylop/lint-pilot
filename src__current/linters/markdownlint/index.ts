import { Linter } from '@Types/lint'

import type { LintReport } from '@Types/lint'

const lintFiles = async () => {
  return Promise.resolve({
    results: {},
    summary: {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.Markdownlint,
      warningCount: 0,
    },
  })
}

const eslintLib = {
  lintFiles,
}

export default eslintLib
