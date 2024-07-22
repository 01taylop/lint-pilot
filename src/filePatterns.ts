import { type FilePatterns, Linter } from '@Types'
import colourLog from '@Utils/colourLog'

type StringOrArray = string | Array<string>

interface GetFilePatterns {
  eslintInclude?: StringOrArray
  ignoreDirs?: StringOrArray
  ignorePatterns?: StringOrArray
}

const enforceArray = (value: StringOrArray = []): Array<string> => Array.of(value).flat()

const getFilePatterns = ({ eslintInclude, ignoreDirs, ignorePatterns }: GetFilePatterns): FilePatterns => {
  const eslintIncludePatterns = [
    '**/*.{cjs,js,jsx,mjs,ts,tsx}',
    ...enforceArray(eslintInclude),
  ]

  const ignoreDirectories = [
    'coverage',
    'dist',
    'node_modules',
    'tmp',
    'tscOutput',
    'vendor',
    ...enforceArray(ignoreDirs),
  ].sort()

  const ignoreGlobs = [
    '**/*.+(map|min).*',
    ...enforceArray(ignorePatterns),
  ].sort()

  const filePatterns = {
    includePatterns: {
      [Linter.ESLint]: eslintIncludePatterns,
      [Linter.Markdownlint]: ['**/*.{md,mdx}'],
      [Linter.Stylelint]: ['**/*.{css,scss,less,sass,styl,stylus}'],
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

export default getFilePatterns
