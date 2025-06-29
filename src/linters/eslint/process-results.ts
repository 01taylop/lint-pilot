import { Linter, RuleSeverity } from '@Types/lint'
import { formatResult } from '@Utils/format-result'

import type { ESLint } from 'eslint'
import type { LintReport, ReportResults, ReportSummary } from '@Types/lint'

const processResults = (results: Array<ESLint.LintResult>): LintReport => {
  const reportResults: ReportResults = {}
  const reportSummary: ReportSummary = {
    deprecatedRules: [],
    errorCount: 0,
    fileCount: results.length,
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    linter: Linter.ESLint,
    warningCount: 0,
  }

  const cwd = process.cwd()
  const deprecatedRulesSet = new Set<string>()

  results.forEach(({ errorCount, filePath, fixableErrorCount, fixableWarningCount, messages, usedDeprecatedRules, warningCount }) => {
    // Normalise file path relative to cwd (handle Windows and POSIX)
    const file = filePath.startsWith(cwd)
      ? filePath.slice(cwd.length + 1)
      : filePath

    // Aggregate counts
    reportSummary.errorCount += errorCount
    reportSummary.fixableErrorCount += fixableErrorCount
    reportSummary.fixableWarningCount += fixableWarningCount
    reportSummary.warningCount += warningCount

    // Process messages
    messages.forEach(({ column, line, message, ruleId, severity }) => {
      if (!reportResults[file]) {
        reportResults[file] = []
      }

      reportResults[file].push(formatResult({
        column: line ? column : undefined,
        lineNumber: line || 0,
        message,
        rule: ruleId || 'core-error',
        severity: severity === 1 ? RuleSeverity.WARNING : RuleSeverity.ERROR,
      }))
    })

    // Accumulate deprecated rules, avoiding duplicates
    usedDeprecatedRules.forEach(({ ruleId }) => deprecatedRulesSet.add(ruleId))
  })

  reportSummary.deprecatedRules = Array.from(deprecatedRulesSet)

  return {
    results: reportResults,
    summary: reportSummary,
  }
}

export {
  processResults,
}
