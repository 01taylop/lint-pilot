import { Linter } from '@Types/lint'

import type { LintCommandOptions } from '@Types/commands'
import type { FilePatterns } from '@Types/lint'

import runLinter from './run-linter'

type RunLintersOptions = Pick<LintCommandOptions, 'cache' | 'eslintUseLegacyConfig' | 'fix' | 'title' | 'watch'> & {
  filePatterns: FilePatterns
  linters?: Array<Linter>
}

const runLinters = async ({ cache, eslintUseLegacyConfig, filePatterns, fix, linters, title, watch }: RunLintersOptions) => {
  const commonArgs = {
    cache,
    eslintUseLegacyConfig,
    fix,
    ignore: filePatterns.ignorePatterns,
  }

  const lintPromises = Object.values(Linter)
    .filter(linter => !linters || linters.includes(linter))
    .map(linter => runLinter({
      ...commonArgs,
      filePattern: filePatterns.includePatterns[linter],
      linter,
    }))

  return Promise.allSettled(lintPromises).then(results => {
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        console.log(`Linter completed successfully:`, result.value)
      } else {
        console.error(`Linter failed:`, result.reason)
      }
    })
  })
}

export default runLinters
