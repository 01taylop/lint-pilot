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

interface ProcessedResult {
  deprecatedRules: Array<string>
  errorCount: number
  fileCount: number
  fixableErrorCount: number
  fixableWarningCount: number
  linter: Linter
  warningCount: number
}

interface LinterResult {
  processedResult: ProcessedResult
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
  ProcessedResult,
  RunLinter,
  RunLintPilot,
}

export {
  Events,
  Linter,
}
