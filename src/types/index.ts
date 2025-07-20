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

interface RunLinter {
  cache: boolean
  eslintUseLegacyConfig?: boolean
  filePatterns: FilePatterns
  fix: boolean
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

export type {
  RunLinter,
  RunLintPilot,
}
