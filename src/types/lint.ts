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
 * REPORTING
 */

interface FormattedResult {
  message: string
  messageTheme: (input: string) => string
  position: string
  positionTheme: (input: string) => string
  rule: string
  ruleTheme: (input: string) => string
  severity: string
  severityTheme: (input: string) => string
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

export type {
  FilePatterns,
  FormattedResult,
}

export {
  Linter,
  RuleSeverity,
}
