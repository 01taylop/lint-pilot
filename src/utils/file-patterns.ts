import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import type { LintCommandOptions } from '@Types/commands'
import type { FilePatterns } from '@Types/lint'

type GetFilePatternsOptions = Pick<LintCommandOptions, 'eslintInclude' | 'ignoreDirs' | 'ignorePatterns'> & {
  linters?: Array<Linter>
}

const getFilePatterns = ({ eslintInclude = [], ignoreDirs = [], ignorePatterns = [], linters }: GetFilePatternsOptions): FilePatterns => {
  const eslintIncludePatterns = [
    '**/*.{cjs,js,jsx,mjs,ts,tsx}',
    ...Array.of(eslintInclude).flat().sort(),
  ]

  const ignoreDirectories = [
    'coverage',
    'dist',
    'generated',
    'node_modules',
    'tmp',
    'tscOutput',
    'vendor',
    ...Array.of(ignoreDirs).flat(),
  ].sort()

  const ignoreGlobs = [
    '**/*.+(map|min).*',
    ...Array.of(ignorePatterns).flat(),
  ].sort()

  const filePatterns = {
    includePatterns: {
      [Linter.ESLint]: eslintIncludePatterns,
      [Linter.Markdownlint]: ['**/*.{md,mdx}'],
      [Linter.Stylelint]: ['**/*.{css,scss,less}'],
    },
    ignorePatterns: [
      `**/+(${ignoreDirectories.join('|')})/**`,
      ...ignoreGlobs,
    ],
  }

  if (!linters || linters.includes(Linter.ESLint)) {
    colourLog.config('ESLint Patterns', filePatterns.includePatterns[Linter.ESLint])
  }
  if (!linters || linters.includes(Linter.Markdownlint)) {
    colourLog.config('Markdownlint Patterns', filePatterns.includePatterns[Linter.Markdownlint])
  }
  if (!linters || linters.includes(Linter.Stylelint)) {
    colourLog.config('Stylelint Patterns', filePatterns.includePatterns[Linter.Stylelint])
  }
  colourLog.config('Ignore', filePatterns.ignorePatterns)
  console.log()

  return filePatterns
}

export {
  getFilePatterns,
}
