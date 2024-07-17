// https://github.com/mysticatea/eslint-plugin-eslint-comments

const bestPractices = {
  'eslint-comments/disable-enable-pair': [2, { allowWholeFile: true }],
  'eslint-comments/no-aggregating-enable': 2,
  'eslint-comments/no-duplicate-disable': 2,
  'eslint-comments/no-unlimited-disable': 2,
  'eslint-comments/no-unused-disable': 2,
  'eslint-comments/no-unused-enable': 2,
}

const stylisticIssues = {
  'eslint-comments/no-restricted-disable': 0,
  'eslint-comments/no-use': 0,
  'eslint-comments/require-description': 0,
}

export default {
  ...bestPractices,
  ...stylisticIssues,
}
