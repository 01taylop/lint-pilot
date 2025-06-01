/*
 * ENUMS
 */

enum Linter {
  ESLint = 'ESLint',
  Markdownlint = 'Markdownlint',
  Stylelint = 'Stylelint',
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
}

export {
  Linter,
}
