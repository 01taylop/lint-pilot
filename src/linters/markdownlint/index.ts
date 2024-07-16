import markdownlint, { type LintResults } from 'markdownlint'

import { Linter, LogType } from '@Types'
import colourLog from '@Utils/colourLog'
import { formatFileLog } from '@Utils/transform'

import type { LinterResult, ResultLogs, ResultSummary } from '@Types'

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

    Object.entries(results).forEach(([file, errors]) => {
      if (!errors.length) {
        return
      }

      logs[file] = []

      summary.errorCount += errors.length

      errors
        .sort((a, b) => a.lineNumber - b.lineNumber || a.ruleNames[1].localeCompare(b.ruleNames[1]))
        .forEach(({ errorDetail, errorRange, fixInfo, lineNumber, ruleDescription, ruleNames }) => {
          logs[file].push(formatFileLog({
            column: errorRange?.length ? errorRange[0] : undefined,
            lineNumber,
            message: errorDetail?.length ? `${ruleDescription}: ${errorDetail}` : ruleDescription,
            rule: ruleNames[1],
            type: LogType.ERROR,
          }))

          if (fixInfo) {
            summary.fixableErrorCount += 1
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
