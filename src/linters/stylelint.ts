import stylelint from 'stylelint'

import { Linter, type LinterResult, type ProcessedResult } from '@Types'

const lintFiles = async (filePaths: Array<string>): Promise<LinterResult> => {
  try {
    const { results, ruleMetadata } = await stylelint.lint({
      allowEmptyInput: true,
      config: {
        rules: {
          'declaration-block-no-duplicate-properties': true,
        },
      },
      files: filePaths,
    })

    const processedResult: ProcessedResult = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: results.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.Stylelint,
      warningCount: 0,
    }

    results.forEach(({ deprecations, warnings }) => {
      processedResult.deprecatedRules = [...new Set([...processedResult.deprecatedRules, ...deprecations.map(({ text }) => text)])]
      processedResult.errorCount += warnings.length
      warnings.forEach(({ rule }) => {
        if (ruleMetadata[rule]?.fixable) {
          processedResult.fixableErrorCount += 1
        }
      })
    })

    return {
      processedResult,
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
