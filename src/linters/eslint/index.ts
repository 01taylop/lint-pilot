import { ESLint, loadESLint } from 'eslint'

import { Linter, RuleSeverity } from '@Types/lint'
import { getCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { formatResult } from '@Utils/format-result'

import type { LintFilesOptions, LintReport, ReportResults, ReportSummary } from '@Types/lint'

const lintFiles = async ({ cache, eslintUseLegacyConfig, files, fix }: LintFilesOptions): Promise<LintReport> => {
  try {
    const CustomESLint = await loadESLint({
      useFlatConfig: !eslintUseLegacyConfig,
    })

    const eslint = new CustomESLint({
      cache,
      cacheLocation: cache ? getCacheDirectory('eslint') : undefined,
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

      const deprecatedRulesSet = new Set(reportSummary.deprecatedRules)
      usedDeprecatedRules.forEach(({ ruleId }) => deprecatedRulesSet.add(ruleId))

      reportSummary.deprecatedRules = Array.from(deprecatedRulesSet)
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
          message,
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
