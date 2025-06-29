import { loadESLint } from 'eslint'

import { getCacheDirectory } from '@Utils/cache'

import { processResults } from './process-results'

import type { LintFilesOptions, LintReport } from '@Types/lint'

const lintFiles = async ({ cache, eslintUseLegacyConfig, files, fix }: LintFilesOptions): Promise<LintReport> => {
  // Load ESLint
  const ESLint = await loadESLint({
    useFlatConfig: !eslintUseLegacyConfig,
  })

  const eslint = new ESLint({
    cache,
    cacheLocation: cache ? getCacheDirectory('eslint') : undefined,
    fix,
  })

  // Run ESLint
  const results = await eslint.lintFiles(files)

  // Process results
  const report = processResults(results)

  // Fix files if requested
  if (fix) {
    await ESLint.outputFixes(results)
  }

  // Return report
  return report
}

export default lintFiles
