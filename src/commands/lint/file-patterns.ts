import type { LintOptions } from '@Types/commands'
import { type FilePatterns, Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

type GetFilePatterns = Pick<LintOptions, 'eslintInclude' | 'ignoreDirs' | 'ignorePatterns'>

const getFilePatterns = ({ eslintInclude = [], ignoreDirs = [], ignorePatterns = [] }: GetFilePatterns): FilePatterns => {
  const eslintIncludePatterns = [
    '**/*.{cjs,js,jsx,mjs,ts,tsx}',
    ...Array.of(eslintInclude).flat(),
  ]

  const ignoreDirectories = [
    'coverage',
    'dist',
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

  colourLog.config('ESLint Patterns', filePatterns.includePatterns[Linter.ESLint])
  colourLog.config('Markdownlint Patterns', filePatterns.includePatterns[Linter.Markdownlint])
  colourLog.config('Stylelint Patterns', filePatterns.includePatterns[Linter.Stylelint])
  colourLog.config('Ignore', filePatterns.ignorePatterns)
  console.log()

  return filePatterns
}

export {
  getFilePatterns,
}
