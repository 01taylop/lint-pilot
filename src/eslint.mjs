import { ESLint } from 'eslint'

const lintFiles = async filePaths => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: {
      rules: {
        'no-console': 2,
        'no-unused-vars': 2,
      },
    },
  })

  const results = await eslint.lintFiles(filePaths)

  const formatter = await eslint.loadFormatter('stylish')
  const resultText = formatter.format(results)
  console.log(resultText)

  return
}

export {
  lintFiles,
}
