import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import { loadConfig } from './load-config'
import { markdownlintAsync } from './markdownlint-async'
import { processResults } from './process-results'

import type { LintFilesOptions, LintReport } from '@Types/lint'

const lintFiles = async ({ files, fix }: LintFilesOptions): Promise<LintReport> => {
  try {
    // Load Config
    const config = loadConfig()

    // Run Markdownlint
    const results = await markdownlintAsync({
      config,
      files,
    })

    // Process results
    const report = processResults(results)

    // Return report
    return report
  } catch (error) {
    colourLog.error(`An error occurred while running ${Linter.Markdownlint}`, error)
    process.exit(1)
  }
}

export default lintFiles
