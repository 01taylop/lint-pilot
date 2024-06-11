import markdownlint, { type LintResults } from 'markdownlint'

import { Linter } from '@Constants'

const lintFiles = (filePaths: Array<string>): Promise<LinterResult> => new Promise((resolve, reject) => {
  markdownlint({
    config: {
      default: true,
    },
    files: filePaths,
  }, (error: any, results: LintResults | undefined) => {
    if (error) {
      console.error(error.stack)
      reject(error)
    }

    if (results) {
      const processedResult: ProcessedResult = {
        deprecatedRules: [],
        errorCount: 0,
        files: results ? Object.keys(results).length : 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: Linter.Markdownlint,
        warningCount: 0,
      }

      Object.entries(results).forEach(([_file, errors]) => {
        processedResult.errorCount += errors.length
        errors.forEach(({ fixInfo }) => {
          if (fixInfo) {
            processedResult.fixableErrorCount += 1
          }
        })
      })

      resolve({
        processedResult,
      })
    }

    // TODO: Throw error if results is undefined
  })
})

const markdownLib = {
  lintFiles,
}

export default markdownLib
