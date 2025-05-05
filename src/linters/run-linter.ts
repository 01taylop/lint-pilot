import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import type { LintCommandOptions } from '@Types/commands'
import type { FilePatterns } from '@Types/lint'

import sourceFiles from './source-files'

type RunLinterOptions = Pick<LintCommandOptions, 'cache' | 'eslintUseLegacyConfig' | 'fix'> & {
  filePattern: FilePatterns['includePatterns'][Linter]
  ignore: FilePatterns['ignorePatterns']
  linter: Linter
}

const runLinter = async ({ cache, eslintUseLegacyConfig, filePattern, fix, linter, ignore }: RunLinterOptions) => {
  const startTime = new Date().getTime()
  colourLog.info(`Running ${linter.toLowerCase()}...`)

  const files = await sourceFiles({
    filePattern,
    ignore,
    linter,
  })

  console.log('Files:', files)
}

export default runLinter
