import stylelint from 'stylelint'

import { getCacheDirectory } from '@Utils/cache'

import { processResults } from './process-results'

import type { LintFilesOptions, LintReport } from '@Types/lint'

const lintFiles = async ({ cache, files, fix }: LintFilesOptions): Promise<LintReport> => {
  // Run Stylelint
  const { results, ruleMetadata } = await stylelint.lint({
    allowEmptyInput: true,
    cache,
    cacheLocation: cache ? getCacheDirectory('stylelint') : undefined,
    config: { // TODO: Replace with externally loaded or user-provided Stylelint config
      rules: {
        'declaration-block-no-duplicate-properties': true,
      },
    },
    files,
    fix,
    quietDeprecationWarnings: true,
    reportDescriptionlessDisables: true,
    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,
  })

  // Process results
  const report = processResults(results, ruleMetadata)

  // Return report
  return report
}

export default lintFiles
