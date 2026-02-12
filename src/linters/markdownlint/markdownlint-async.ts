import markdownlint, { type LintResults, type Options } from 'markdownlint'

const markdownlintAsync = (options: Options): Promise<LintResults> => new Promise((resolve, reject) => {
  markdownlint(options, (error, result) => {
    if (error) {
      reject(error)
      return
    }
    resolve(result || {})
  })
})

export {
  markdownlintAsync,
}
