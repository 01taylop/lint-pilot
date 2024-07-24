import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import markdownlint, { type Configuration } from 'markdownlint'

import colourLog from '@Utils/colourLog'

const loadConfig = (): [string, Configuration] => {
  try {
    // Custom config
    const customConfigPath = `${process.cwd()}/.markdownlint.json`
    if (fs.existsSync(customConfigPath)) {
      return ['custom', markdownlint.readConfigSync(customConfigPath)]
    }

    // Default config
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const localConfigPath = path.resolve(__dirname, './markdownlint.json')
    return ['default', markdownlint.readConfigSync(localConfigPath)]
  } catch (error) {
    colourLog.error('An error occurred while loading the markdownlint config', error)
    process.exit(1)
  }
}

export default loadConfig
