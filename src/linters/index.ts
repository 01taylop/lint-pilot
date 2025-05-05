import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import type { LintCommandOptions } from '@Types/commands'
import type { FilePatterns, LintReport } from '@Types/lint'

import { reportResults, reportSummaryBlock } from './reporting'
import runLinter from './run-linter'
import { notifyResults } from './notifier'

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
    const reports: Array<LintReport> = []

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        reports.push(result.value)
      } else {
        console.error(`Linter failed:`, result.reason)
      }
    })

    reports.forEach(report => {
      reportResults(report)
    })

    reports.forEach(({ summary }) => {
      reportSummaryBlock(summary)
    })

    const exitCode = notifyResults(reports, title)

    if (watch) {
      colourLog.info('Watching for changes...')
    } else if (results.length !== reports.length) {
      process.exit(1)
    } else {
      process.exit(exitCode)
    }
  })
}

export default runLinters
