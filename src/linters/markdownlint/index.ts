import markdownlint, { type LintResults } from 'markdownlint'

import { Linter, RuleSeverity } from '@Types'
import colourLog from '@Utils/colourLog'
import { formatResult } from '@Utils/transform'

import type { LintFiles, LintReport, ReportResults, ReportSummary } from '@Types'

import loadConfig from './loadConfig'

const lintFiles = ({ files, fix }: LintFiles): Promise<LintReport> => new Promise((resolve, _reject) => {
  const [configName, config] = loadConfig()

  colourLog.configDebug(`Using ${configName} markdownlint config:`, config)

  markdownlint({
    config,
    files,
  }, (error: any, lintResults: LintResults | undefined = {}) => {
    if (error) {
      colourLog.error('An error occurred while running markdownlint', error)
      process.exit(1)
    }

    const reportResults: ReportResults = {}

    const reportSummary: ReportSummary = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: Object.keys(lintResults).length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.Markdownlint,
      warningCount: 0,
    }

    Object.entries(lintResults).forEach(([file, errors]) => {
      if (!errors.length) {
        return
      }

      reportResults[file] = []

      reportSummary.errorCount += errors.length

      errors
        .sort((a, b) => a.lineNumber - b.lineNumber || a.ruleNames[1].localeCompare(b.ruleNames[1]))
        .forEach(({ errorDetail, errorRange, fixInfo, lineNumber, ruleDescription, ruleNames }) => {
          reportResults[file].push(formatResult({
            column: errorRange?.length ? errorRange[0] : undefined,
            lineNumber,
            message: errorDetail?.length ? `${ruleDescription}: ${errorDetail}` : ruleDescription,
            rule: ruleNames[1],
            severity: RuleSeverity.ERROR,
          }))

          if (fixInfo) {
            reportSummary.fixableErrorCount += 1
          }
        })
    })

    resolve({
      results: reportResults,
      summary: reportSummary,
    })
  })
})

const markdownlintLib = {
  lintFiles,
}

export default markdownlintLib
