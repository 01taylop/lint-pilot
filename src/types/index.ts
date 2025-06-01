/*
 * ENUMS
 */

enum Events {
  FILE_CHANGED = 'FILE_CHANGED',
}

enum Linter {
  ESLint = 'ESLint',
  Markdownlint = 'Markdownlint',
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

interface LintFiles {
  cache: boolean
  eslintUseLegacyConfig?: boolean
  files: Array<string>
  fix: boolean
}

interface RunLinter {
  cache: boolean
  eslintUseLegacyConfig?: boolean
  filePattern: Array<string>
  fix: boolean
  ignore: Array<string>
  linter: Linter
}

interface RunLintPilot {
  cache: boolean
  eslintUseLegacyConfig: boolean
  filePatterns: FilePatterns
  fix: boolean
  title: string
  watch: boolean
}

/*
 * EXPORT
 */

export type {
  FilePatterns,
  FormattedResult,
  LintFiles,
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
