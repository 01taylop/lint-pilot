import markdownlint, { type LintResults } from 'markdownlint'

import colourLog from '@Utils/colourLog'
import { Linter, type LinterResult, type ProcessedResult } from '@Types'

import loadConfig from './loadConfig'

const lintFiles = (files: Array<string>): Promise<LinterResult> => new Promise((resolve, reject) => {
  const [configName, config] = loadConfig()

  if (global.debug) {
    console.log(`Using ${configName} markdownlint config:`, config)
  }

  markdownlint({
    config,
    files,
  }, (error: any, results: LintResults | undefined) => {
    if (error) {
      colourLog.error('An error occurred while running markdownlint', error)
      return reject(error)
    }

    if (!results) {
      colourLog.error('An error occurred while running markdownlint: no results')
      return reject(error)
    }

    const processedResult: ProcessedResult = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: Object.keys(results).length,
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
  })
})

const markdownLib = {
  lintFiles,
}

export default markdownLib
