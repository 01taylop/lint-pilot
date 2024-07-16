import { ESLint } from 'eslint'

import { Linter, type LinterResult, type ResultSummary } from '@Types'

const lintFiles = async (files: Array<string>): Promise<LinterResult> => {
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

    const summary: ResultSummary = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: results.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.ESLint,
      warningCount: 0,
    }

    results.forEach(({ errorCount, fixableErrorCount, fixableWarningCount, usedDeprecatedRules, warningCount }) => {
      summary.deprecatedRules = [...new Set([...summary.deprecatedRules, ...usedDeprecatedRules.map(({ ruleId }) => ruleId)])]
      summary.errorCount += errorCount
      summary.fixableErrorCount += fixableErrorCount
      summary.fixableWarningCount += fixableWarningCount
      summary.warningCount += warningCount
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

const eslintLib = {
  lintFiles,
}

export default eslintLib
