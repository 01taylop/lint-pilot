enum Events {
  FILE_CHANGED = 'FILE_CHANGED',
}

enum Linter {
  ESLint = 'ESLint',
  Markdownlint = 'MarkdownLint',
  Stylelint = 'Stylelint',
}

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

export type {
  LinterResult,
  ProcessedResult,
}

export {
  Events,
  Linter,
}
