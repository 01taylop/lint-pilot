import lintFiles from './lint-files'

import type { LinterInterface } from '@Types/lint'

const markdownlintAdapter: LinterInterface = {
  lintFiles,
}

export default markdownlintAdapter
