import fs from 'fs'
import path from 'path'
import util from 'util'

const configFolder = './config'
const outputFolder = './lib'

/*
 * Utilities
 */

const writeFile = async (filename: string, contents: Record<string, unknown>): Promise<void> => {
  const contentsString = util.inspect(contents, {
    depth: Infinity,
    maxArrayLength: Infinity,
    maxStringLength: Infinity,
  })

  await fs.promises.writeFile(filename, `module.exports = ${contentsString}\n`)
}

/*
 * Compile Lint Configuration
 */

const compileLintConfiguration = async (): Promise<void> => {
  try {
    const files = await fs.promises.readdir(configFolder)

    for (const file of files) {
      const filePath = path.join(configFolder, file)

      if ((await fs.promises.stat(filePath)).isFile()) {
        const filename = path.parse(file).name

        console.log(`Building config from "${file}"`)

        const module = await import(filePath)
        await writeFile(path.join(outputFolder, `${filename}.js`), module.default)

        console.log(`Successfully built "${filename}.js"!\n`)
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

/*
 * Copy Additional Files
 */

const copyFiles = async () => {
  try {
    const files = [
      'package.json',
      'README.md',
    ]

    for (const file of files) {
      const sourcePath = path.resolve(`./${file}`)
      const destinationPath = path.join(outputFolder, file)

      await fs.promises.copyFile(sourcePath, destinationPath)
      console.log(`Successfully copied "${file}" to output folder`)
    }
  } catch (error) {
    console.error('An error occurred while copying files:', error)
    process.exit(1)
  }
}

/*
 * Run
 */

const init = async () => {
  await compileLintConfiguration()
  await copyFiles()
}

init()
