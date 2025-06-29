import { Linter, RuleSeverity } from '@Types/lint'
import { formatResult } from '@Utils/format-result'

import type { LintResult, RuleMeta } from 'stylelint'
import type { LintReport, ReportResults, ReportSummary } from '@Types/lint'

type RuleMetadata = { [ruleName: string]: Partial<RuleMeta> }

const processResults = (results: Array<LintResult>, ruleMetadata: RuleMetadata): LintReport => {
  const reportResults: ReportResults = {}
  const reportSummary: ReportSummary = {
    deprecatedRules: [],
    errorCount: 0,
    fileCount: results.length,
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    linter: Linter.Stylelint,
    warningCount: 0,
  }

  const cwd = process.cwd()
  const deprecatedRulesSet = new Set<string>()

  results.forEach(({ deprecations, source, warnings }) => {
    // Normalise file path relative to cwd (handle Windows and POSIX)
    const file = source
      ? source.startsWith(cwd)
        ? source.slice(cwd.length + 1)
        : source
      : 'unknown source'

    // Process warnings
    warnings.forEach(({ column, line, rule, text, severity }) => {
      const isWarning = severity === 'warning'

      reportSummary[isWarning ? 'warningCount' : 'errorCount'] += 1

      if (!reportResults[file]) {
        reportResults[file] = []
      }

      reportResults[file].push(formatResult({
        column,
        lineNumber: line,
        message: text.replace(`(${rule})`, ''),
        rule,
        severity: isWarning ? RuleSeverity.WARNING : RuleSeverity.ERROR,
      }))

      if (ruleMetadata[rule]?.fixable) {
        if (isWarning) {
          reportSummary.fixableWarningCount += 1
        } else {
          reportSummary.fixableErrorCount += 1
        }
      }
    })

    // Accumulate deprecated rules, avoiding duplicates
    deprecations.forEach(({ text }) => deprecatedRulesSet.add(text))
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
