import { Linter, RuleSeverity } from '@Types'
import { formatResult } from '@Utils/format-result'

import type { LintResults } from 'markdownlint'
import type { LintReport, ReportResults, ReportSummary } from '@Types'

const processResults = (lintResults: LintResults): LintReport => {
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

  return {
    results: reportResults,
    summary: reportSummary,
  }
}

export {
  processResults,
}
