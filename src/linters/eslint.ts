// import formatter from 'eslint-formatter-pretty'
import { ESLint } from 'eslint'

import { Linter } from '@Constants'

const lintFiles = async (filePaths: Array<string>): Promise<LinterResult> => {
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

    const results = await eslint.lintFiles(filePaths)

    const processedResult: ProcessedResult = {
      deprecatedRules: [],
      errorCount: 0,
      files: results.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.ESLint,
      warningCount: 0,
    }

    results.forEach(({ errorCount, fixableErrorCount, fixableWarningCount, usedDeprecatedRules, warningCount }) => {
      processedResult.deprecatedRules = [...new Set([...processedResult.deprecatedRules, ...usedDeprecatedRules.map(({ ruleId }) => ruleId)])]
      processedResult.errorCount += errorCount
      processedResult.fixableErrorCount += fixableErrorCount
      processedResult.fixableWarningCount += fixableWarningCount
      processedResult.warningCount += warningCount
    })

    // const formattedResults = formatter(results)
    // console.log(formattedResults)

    return {
      processedResult,
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
