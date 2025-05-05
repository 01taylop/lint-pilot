import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import linters from './linters'
import { reportSummary } from './reporting'
import sourceFiles from './source-files'

import type { LintCommandOptions } from '@Types/commands'
import type { FilePatterns, LintReport } from '@Types/lint'

type RunLinterOptions = Pick<LintCommandOptions, 'cache' | 'eslintUseLegacyConfig' | 'fix'> & {
  filePattern: FilePatterns['includePatterns'][Linter]
  ignore: FilePatterns['ignorePatterns']
  linter: Linter
}

const runLinter = async ({ cache, eslintUseLegacyConfig, filePattern, fix, linter, ignore }: RunLinterOptions): Promise<LintReport> => {
  const startTime = new Date().getTime()
  colourLog.info(`Running ${linter.toLowerCase()}...`)

  const files = await sourceFiles({
    filePattern,
    ignore,
    linter,
  })

  const report: LintReport = await linters[linter].lintFiles({
    cache,
    eslintUseLegacyConfig,
    files,
    fix,
  })

  reportSummary(report.summary, startTime)

  return report
}

export default runLinter
