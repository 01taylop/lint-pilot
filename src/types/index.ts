/*
 * ENUMS
 */

enum Events {
  FILE_CHANGED = 'FILE_CHANGED',
}

enum Linter {
  ESLint = 'ESLint',
  Markdownlint = 'MarkdownLint',
  Stylelint = 'Stylelint',
}

/*
 * LINT RESULTS
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

/*
 * LINT PILOT
 */

interface RunLinter {
  filePattern: string
  linter: Linter
}

interface RunLintPilot {
  title: string
  watch: boolean
}

/*
 * EXPORT
 */

export type {
  FormattedResult,
  LintReport,
  ReportResults,
  ReportSummary,
  RunLinter,
  RunLintPilot,
}

export {
  Events,
  Linter,
  RuleSeverity,
}
