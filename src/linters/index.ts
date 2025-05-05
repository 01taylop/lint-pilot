import type { LintCommandOptions } from '@Types/commands'
import type { FilePatterns, Linter } from '@Types/lint'

type RunLintersOptions = Pick<LintCommandOptions, 'cache' | 'eslintUseLegacyConfig' | 'fix' | 'title' | 'watch'> & {
  filePatterns: FilePatterns
  linters?: Array<Linter>
}

const runLinters = ({ cache, eslintUseLegacyConfig, filePatterns, fix, linters, title, watch }: RunLintersOptions) => {
  console.log('Running linters...')
}

export default runLinters
