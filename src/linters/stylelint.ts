import stylelint from 'stylelint'

import { Linter, type LinterResult, type ResultSummary } from '@Types'

const lintFiles = async (files: Array<string>): Promise<LinterResult> => {
  try {
    const { results, ruleMetadata } = await stylelint.lint({
      allowEmptyInput: true,
      config: {
        rules: {
          'declaration-block-no-duplicate-properties': true,
        },
      },
      files,
    })

    const summary: ResultSummary = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: results.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.Stylelint,
      warningCount: 0,
    }

    results.forEach(({ deprecations, warnings }) => {
      summary.deprecatedRules = [...new Set([...summary.deprecatedRules, ...deprecations.map(({ text }) => text)])]
      summary.errorCount += warnings.length

      warnings.forEach(({ rule }) => {
        if (ruleMetadata[rule]?.fixable) {
          summary.fixableErrorCount += 1
        }
      })
    })

    return {
      logs: {},
      summary,
    }
  } catch (error: any) {
    console.error(error.stack)
    throw error
  }
}

const stylelintLib = {
  lintFiles,
}

export default stylelintLib
