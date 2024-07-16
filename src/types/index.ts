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

enum LogType {
  ERROR = 'error',
  WARNING = 'warning',
}

interface FileLog {
  message: string
  messageTheme: Function
  position: string
  positionTheme: Function
  rule: string
  ruleTheme: Function
  type: string
}

interface ResultLogs {
  [file: string]: Array<FileLog>
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
  FileLog,
  LinterResult,
  ResultLogs,
  ResultSummary,
  RunLinter,
  RunLintPilot,
}

export {
  Events,
  Linter,
  LogType,
}
