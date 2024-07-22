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
 * LINT REPORT
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

interface FilePatterns {
  includePatterns: {
    [key in Linter]: Array<string>
  }
  ignorePatterns: Array<string>
}

interface RunLinter {
  filePattern: Array<string>
  ignore: Array<string>
  linter: Linter
}

interface RunLintPilot {
  filePatterns: FilePatterns
  title: string
  watch: boolean
}

/*
 * EXPORT
 */

export type {
  FilePatterns,
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
