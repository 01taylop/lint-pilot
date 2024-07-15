import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import markdownlint, { type Configuration, type LintResults } from 'markdownlint'

import colourLog from '@Utils/colourLog'
import { Linter, type LinterResult, type ProcessedResult } from '@Types'

const loadConfig = (): [string, Configuration] => {
  try {
    // Custom Config
    const customConfigPath = `${process.cwd()}/markdownlint.json`
    if (fs.existsSync(customConfigPath)) {
      return ['custom', markdownlint.readConfigSync(customConfigPath)]
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    // Local config (if in development mode) - this block will be removed in production builds
    if (process.env.NODE_ENV === 'development') {
      const localConfigPath = path.resolve(__dirname, '../../config/markdownlint.json')
      return ['development', markdownlint.readConfigSync(localConfigPath)]
    }

    // Local config (if in production mode)
    const localConfigPath = path.resolve(__dirname, './markdownlint.json')
    return ['default', markdownlint.readConfigSync(localConfigPath)]
  } catch (error) {
    colourLog.error('An error occurred while loading the markdownlint config', error)
    process.exit(1)
  }
}

const lintFiles = (files: Array<string>): Promise<LinterResult> => new Promise((resolve, reject) => {
  const [configName, config] = loadConfig()

  if (global.debug) {
    console.log(`Using ${configName} markdownlint config:`, config)
  }

  markdownlint({
    config,
    files,
  }, (error: any, results: LintResults | undefined) => {
    if (error) {
      colourLog.error('An error occurred while running markdownlint', error)
      return reject(error)
    }

    if (!results) {
      colourLog.error('An error occurred while running markdownlint: no results')
      return reject(error)
    }

    const processedResult: ProcessedResult = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: Object.keys(results).length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.Markdownlint,
      warningCount: 0,
    }

    Object.entries(results).forEach(([_file, errors]) => {
      processedResult.errorCount += errors.length
      errors.forEach(({ fixInfo }) => {
        if (fixInfo) {
          processedResult.fixableErrorCount += 1
        }
      })
    })

    resolve({
      processedResult,
    })
  })
})

const markdownLib = {
  lintFiles,
}

export default markdownLib
