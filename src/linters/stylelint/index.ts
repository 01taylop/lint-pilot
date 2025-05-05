import stylelint from 'stylelint'

import { Linter, RuleSeverity } from '@Types/lint'
import { getCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { formatResult } from '@Utils/format-result'

import type { LintFilesOptions, LintReport, ReportResults, ReportSummary } from '@Types/lint'

const lintFiles = async ({ cache, files, fix }: LintFilesOptions): Promise<LintReport> => {
  try {
    // TODO: Stylelint config, extensible?
    const {
      results: lintResults,
      ruleMetadata,
    } = await stylelint.lint({
      allowEmptyInput: true,
      cache,
      cacheLocation: cache ? getCacheDirectory('stylelint') : undefined,
      config: {
        rules: {
          'declaration-block-no-duplicate-properties': true,
        },
      },
      files,
      fix,
      quietDeprecationWarnings: true,
      reportDescriptionlessDisables: true,
      reportInvalidScopeDisables: true,
      reportNeedlessDisables: true,
    })

    const reportResults: ReportResults = {}

    const reportSummary: ReportSummary = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: lintResults.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.Stylelint,
      warningCount: 0,
    }

    lintResults.forEach(({ deprecations, source, warnings }) => {
      const file = source ? source.replace(`${process.cwd()}/`, '') : 'unknown-source'

      const deprecatedRulesSet = new Set(reportSummary.deprecatedRules)
      deprecations.forEach(({ text }) => deprecatedRulesSet.add(text))

      reportSummary.deprecatedRules = Array.from(deprecatedRulesSet)
      reportSummary.errorCount += warnings.length

      warnings.forEach(({ column, line, rule, text }) => {
        if (!reportResults[file]) {
          reportResults[file] = []
        }

        reportResults[file].push(formatResult({
          column,
          lineNumber: line,
          message: text.replace(`(${rule})`, ''),
          rule,
          severity: RuleSeverity.ERROR,
        }))

        if (ruleMetadata[rule]?.fixable) {
          reportSummary.fixableErrorCount += 1
        }
      })
    })

    return {
      results: reportResults,
      summary: reportSummary,
    }
  } catch (error: any) {
    colourLog.error('An error occurred while running stylelint', error)
    process.exit(1)
  }
}

const stylelintLib = {
  lintFiles,
}

export default stylelintLib
