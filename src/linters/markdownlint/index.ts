import colourLog from '@Utils/colour-log'

import type { LintFiles, LintReport } from '@Types'

import fixFile from './fix-file'
import loadConfig from './load-config'
import markdownlintAsync, { type LintResults } from './markdownlint-async'
import processResults from './process-results'

const lintFiles = async ({ files, fix }: LintFiles): Promise<LintReport> => {
  try {
    const [configName, config] = loadConfig()

    colourLog.configDebug(`Using ${configName} markdownlint config:`, config)

    if (fix) {
      const fixableLintResults: LintResults = await markdownlintAsync({
        config,
        files,
      })

      let fixedFiles = false

      Object.entries(fixableLintResults).forEach(([file, errors]) => {
        if (errors.some(error => error.fixInfo !== undefined)) {
          fixFile({
            errors,
            file,
          })
          fixedFiles = true
        }
      })

      if (!fixedFiles) {
        return processResults(fixableLintResults)
      }
    }

    const lintResults = await markdownlintAsync({
      config,
      files,
    })
    return processResults(lintResults)
  } catch (error) {
    colourLog.error('An error occurred while running markdownlint', error)
    process.exit(1)
  }
}

const markdownlintLib = {
  lintFiles,
}

export default markdownlintLib
