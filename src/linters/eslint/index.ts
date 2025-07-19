import lintFiles from './lint-files'

import type { LinterInterface } from '@Types/lint'

const eslintAdapter: LinterInterface = {
  lintFiles,
}

export default eslintAdapter
