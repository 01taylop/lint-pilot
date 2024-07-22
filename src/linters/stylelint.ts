import stylelint from 'stylelint'

import { Linter, RuleSeverity } from '@Types'
import colourLog from '@Utils/colourLog'
import { formatResult } from '@Utils/transform'

import type { LintReport, ReportResults, ReportSummary } from '@Types'

const lintFiles = async (files: Array<string>): Promise<LintReport> => {
  try {
    // TODO: Stylelint config, extensible?
    const {
      results: lintResults,
      ruleMetadata,
    } = await stylelint.lint({
      allowEmptyInput: true,
      config: {
        rules: {
          'declaration-block-no-duplicate-properties': true,
        },
      },
      files,
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

      reportSummary.deprecatedRules = [...new Set([...reportSummary.deprecatedRules, ...deprecations.map(({ text }) => text)])]
      reportSummary.errorCount += warnings.length

      warnings.forEach(({ column, line, rule, text }) => {
        if (!reportResults[file]) {
          reportResults[file] = []
        }

        reportResults[file].push(formatResult({
          column,
          lineNumber: line,
          message: text.replace(`(${rule})`, '').trim(),
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
