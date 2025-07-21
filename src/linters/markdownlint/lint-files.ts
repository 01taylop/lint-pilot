import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import { fixFile } from './fix-file'
import { loadConfig } from './load-config'
import { markdownlintAsync } from './markdownlint-async'
import { processResults } from './process-results'

import type { LintFilesOptions, LintReport } from '@Types/lint'

const lintFiles = async ({ files, fix }: LintFilesOptions): Promise<LintReport> => {
  try {
    const config = loadConfig()
    const markdownlintOptions = {
      config,
      files,
    }

    // Run Markdownlint
    let results = await markdownlintAsync(markdownlintOptions)

    // Fix errors, then re-run to ensure the report reflects the fixed state
    if (fix) {
      let filesWereFixed = false

      for (const [file, errors] of Object.entries(results)) {
        if (errors.some(error => error.fixInfo)) {
          fixFile({ file, errors })
          filesWereFixed = true
        }
      }

      if (filesWereFixed) {
        results = await markdownlintAsync(markdownlintOptions)
      }
    }

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
