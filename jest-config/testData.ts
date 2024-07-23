import { type LintError } from 'markdownlint'

/*
 * MARKDOWNLINT
 */

export const markdownlintError: LintError = {
  errorContext: 'test-error-context',
  errorDetail: 'test-error-detail',
  errorRange: [1, 2],
  lineNumber: 1,
  fixInfo: {
    lineNumber: 1,
    insertText: 'test-insert-text',
  },
  ruleDescription: 'test-rule-description',
  ruleInformation: 'test-rule-information',
  ruleNames: ['MD000', 'test-rule-name'],
}
