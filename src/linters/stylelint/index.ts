import lintFiles from './lint-files'

import type { LinterInterface } from '@Types/lint'

const stylelintAdapter: LinterInterface = {
  lintFiles,
}

export default stylelintAdapter
