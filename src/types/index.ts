enum Linter {
  ESLint = 'ESLint',
  Markdownlint = 'Markdownlint',
  Stylelint = 'Stylelint',
}

interface FilePatterns {
  includePatterns: {
    [key in Linter]: Array<string>
  }
  ignorePatterns: Array<string>
}

interface RunLintPilot {
  cache: boolean
  eslintUseLegacyConfig: boolean
  filePatterns: FilePatterns
  fix: boolean
  title: string
  watch: boolean
}

export type {
  RunLintPilot,
}
