import markdownlint from 'markdownlint'

import type { LintResults, Options } from 'markdownlint'

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
