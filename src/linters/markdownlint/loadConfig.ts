import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import markdownlint, { type Configuration } from 'markdownlint'

import colourLog from '@Utils/colourLog'

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
      const localConfigPath = path.resolve(__dirname, '../../../config/markdownlint.json')
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

export default loadConfig
