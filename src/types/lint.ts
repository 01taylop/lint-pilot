/*
 * ENUMS
 */

enum Linter {
  ESLint = 'ESLint',
  Markdownlint = 'Markdownlint',
  Stylelint = 'Stylelint',
}

/*
 * LINTING
 */

interface FilePatterns {
  includePatterns: {
    [key in Linter]: Array<string>
  }
  ignorePatterns: Array<string>
}

interface LintFilesOptions {
  cache: boolean
  eslintUseLegacyConfig?: boolean
  files: Array<string>
  fix: boolean
}

/*
 * REPORTING
 */

enum RuleSeverity {
  ERROR = 'error',
  WARNING = 'warning',
}

interface FormattedResult {
  message: string
  messageTheme: Function
  position: string
  positionTheme: Function
  rule: string
  ruleTheme: Function
  severity: string
}

interface ReportResults {
  [file: string]: Array<FormattedResult>
}

interface ReportSummary {
  deprecatedRules: Array<string>
  errorCount: number
  fileCount: number
  fixableErrorCount: number
  fixableWarningCount: number
  linter: Linter
  warningCount: number
}

interface LintReport {
  results: ReportResults
  summary: ReportSummary
}

export type {
  FilePatterns,
  FormattedResult,
  LintFilesOptions,
  LintReport,
  ReportResults,
  ReportSummary,
}

export {
  Linter,
  RuleSeverity,
}
