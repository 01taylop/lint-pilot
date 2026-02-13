import fs from 'node:fs'
import path from 'node:path'

import markdownlint, { type Configuration } from 'markdownlint'

import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import defaultConfig from '../../../config/markdownlint.json'

const loadConfig = (): Configuration => {
  try {
    // Custom config
    const customConfigPath = path.join(process.cwd(), '.markdownlint.json')
    if (fs.existsSync(customConfigPath)) {
      const config = markdownlint.readConfigSync(customConfigPath)

      colourLog.configDebug(`Using custom ${Linter.Markdownlint} config:`, config)
      return config
    }

    // Default config
    colourLog.configDebug(`Using default ${Linter.Markdownlint} config:`, defaultConfig)
    return defaultConfig as Configuration
  } catch (error) {
    colourLog.error(`An error occurred while loading the ${Linter.Markdownlint} config`, error)
    process.exit(1)
  }
}

export {
  loadConfig,
}
