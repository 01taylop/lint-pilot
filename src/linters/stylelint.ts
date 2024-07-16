import stylelint from 'stylelint'

import { Linter, type LintReport, type ReportSummary } from '@Types'

const lintFiles = async (files: Array<string>): Promise<LintReport> => {
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

    const reportSummary: ReportSummary = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: results.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.Stylelint,
      warningCount: 0,
    }

    results.forEach(({ deprecations, warnings }) => {
      reportSummary.deprecatedRules = [...new Set([...reportSummary.deprecatedRules, ...deprecations.map(({ text }) => text)])]
      reportSummary.errorCount += warnings.length

      warnings.forEach(({ rule }) => {
        if (ruleMetadata[rule]?.fixable) {
          reportSummary.fixableErrorCount += 1
        }
      })
    })

    return {
      results: {},
      summary: reportSummary,
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
