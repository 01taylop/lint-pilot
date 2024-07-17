import { ESLint } from 'eslint'

import { Linter, type LintReport, type ReportSummary } from '@Types'

const lintFiles = async (files: Array<string>): Promise<LintReport> => {
  try {
    const eslint = new ESLint({
      // @ts-expect-error
      overrideConfigFile: true,
      overrideConfig: {
        rules: {
          'quotes': [2, 'single'],
          'no-console': 2,
          'no-ternary': 1,
          'no-unused-vars': 2,
        },
      },
    })

    const results = await eslint.lintFiles(files)

    const reportSummary: ReportSummary = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: results.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.ESLint,
      warningCount: 0,
    }

    results.forEach(({ errorCount, fixableErrorCount, fixableWarningCount, usedDeprecatedRules, warningCount }) => {
      reportSummary.deprecatedRules = [...new Set([...reportSummary.deprecatedRules, ...usedDeprecatedRules.map(({ ruleId }) => ruleId)])]
      reportSummary.errorCount += errorCount
      reportSummary.fixableErrorCount += fixableErrorCount
      reportSummary.fixableWarningCount += fixableWarningCount
      reportSummary.warningCount += warningCount
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

const eslintLib = {
  lintFiles,
}

export default eslintLib
