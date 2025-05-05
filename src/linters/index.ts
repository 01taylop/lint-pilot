import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import { reportResults, reportSummaryBlock } from './reporting'
import runLinter from './run-linter'
import { notifyResults } from './notifier'

import type { LintCommandOptions } from '@Types/commands'
import type { FilePatterns, LintReport } from '@Types/lint'

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

  const reports: Array<LintReport> = await Promise.all(lintPromises)

  reports.forEach(report => {
    reportResults(report)
  })

  reports.forEach(({ summary }) => {
    reportSummaryBlock(summary)
  })

  const exitCode = notifyResults(reports, title)

  if (watch) {
    colourLog.info('Watching for changes...')
  } else {
    process.exit(exitCode)
  }
}

export default runLinters
