/*
 * ENUMS
 */

enum Linter {
  ESLint = 'ESLint',
  Markdownlint = 'Markdownlint',
  Stylelint = 'Stylelint',
}

enum RuleSeverity {
  ERROR = 'error',
  WARNING = 'warning',
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

/*
 * REPORTING
 */

interface FormattedResult {
  message: string
  messageTheme: (message: string) => string
  position: string
  positionTheme: (position: string) => string
  rule: string
  ruleTheme: (rule: string) => string
  severity: string
  severityTheme: (severity: string) => string
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

/*
 * EXPORTS
 */

export type {
  FilePatterns,
  FormattedResult,
  LintReport,
  ReportResults,
  ReportSummary,
}

export {
  Linter,
  RuleSeverity,
}
