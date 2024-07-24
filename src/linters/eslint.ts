import { ESLint } from 'eslint'

import { Linter, RuleSeverity } from '@Types'
import { getCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colourLog'
import { formatResult } from '@Utils/transform'

import type { LintFiles, LintReport, ReportResults, ReportSummary } from '@Types'

const lintFiles = async ({ cache, files, fix }: LintFiles): Promise<LintReport> => {
  try {
    const eslint = new ESLint({
      cache,
      cacheLocation: cache ? getCacheDirectory('.eslintcache') : undefined,
      fix,
    })

    const lintResults: Array<ESLint.LintResult> = await eslint.lintFiles(files)

    const reportResults: ReportResults = {}

    const reportSummary: ReportSummary = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: lintResults.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.ESLint,
      warningCount: 0,
    }

    lintResults.forEach(({ errorCount, filePath, fixableErrorCount, fixableWarningCount, messages, usedDeprecatedRules, warningCount }) => {
      const file = filePath.replace(`${process.cwd()}/`, '')

      reportSummary.deprecatedRules = [...new Set([...reportSummary.deprecatedRules, ...usedDeprecatedRules.map(({ ruleId }) => ruleId)])]
      reportSummary.errorCount += errorCount
      reportSummary.fixableErrorCount += fixableErrorCount
      reportSummary.fixableWarningCount += fixableWarningCount
      reportSummary.warningCount += warningCount

      messages.forEach(({ column, line, message, ruleId, severity }) => {
        if (!reportResults[file]) {
          reportResults[file] = []
        }

        reportResults[file].push(formatResult({
          column: line ? column : undefined,
          lineNumber: line || 0,
          message: message.trim(),
          rule: ruleId || 'core-error',
          severity: severity === 1 ? RuleSeverity.WARNING : RuleSeverity.ERROR,
        }))
      })
    })

    if (fix) {
      await ESLint.outputFixes(lintResults)
    }

    return {
      results: reportResults,
      summary: reportSummary,
    }
  } catch (error: any) {
    colourLog.error('An error occurred while running eslint', error)
    process.exit(1)
  }
}

const eslintLib = {
  lintFiles,
}

export default eslintLib
