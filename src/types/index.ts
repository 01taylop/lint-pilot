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

interface ResultLogs {
  [file: string]: Array<{
    message: string
    position: string
    rule: string
    type: 'error' | 'warning'
  }>
}

interface ResultSummary {
  deprecatedRules: Array<string>
  errorCount: number
  fileCount: number
  fixableErrorCount: number
  fixableWarningCount: number
  linter: Linter
  warningCount: number
}

interface LinterResult {
  logs: ResultLogs
  summary: ResultSummary
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
  LinterResult,
  ResultLogs,
  ResultSummary,
  RunLinter,
  RunLintPilot,
}

export {
  Events,
  Linter,
}
