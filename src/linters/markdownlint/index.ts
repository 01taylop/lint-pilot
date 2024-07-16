import markdownlint, { type LintResults } from 'markdownlint'

import { Linter, type LinterResult, type ResultLogs, type ResultSummary } from '@Types'
import colourLog from '@Utils/colourLog'

import loadConfig from './loadConfig'

const lintFiles = (files: Array<string>): Promise<LinterResult> => new Promise((resolve, reject) => {
  const [configName, config] = loadConfig()

  colourLog.configDebug(`Using ${configName} markdownlint config:`, config)

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
      return reject(new Error('No results'))
    }

    const logs: ResultLogs = {}

    const summary: ResultSummary = {
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
      logs,
      summary,
    })
  })
})

const markdownLib = {
  lintFiles,
}

export default markdownLib
