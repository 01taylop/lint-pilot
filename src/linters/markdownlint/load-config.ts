import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { readConfigSync } from 'markdownlint'

import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import type { Configuration } from 'markdownlint'

const loadConfig = (): Configuration => {
  try {
    // Custom config
    const customConfigPath = path.join(process.cwd(), '.markdownlint.json')
    if (fs.existsSync(customConfigPath)) {
      const config = readConfigSync(customConfigPath)

      colourLog.configDebug(`Using custom ${Linter.Markdownlint} config:`, config)
      return config
    }

    // Default config
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const localConfigPath = path.resolve(__dirname, './markdownlint.json')
    const config = readConfigSync(localConfigPath)

    colourLog.configDebug(`Using default ${Linter.Markdownlint} config:`, config)
    return config
  } catch (error) {
    colourLog.error(`An error occurred while loading the ${Linter.Markdownlint} config`, error)
    process.exit(1)
  }
}

export {
  loadConfig,
}
