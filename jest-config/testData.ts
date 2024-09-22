import type { LintError } from 'markdownlint'

const expectedResultThemes = {
  messageTheme: expect.any(Function),
  positionTheme: expect.any(Function),
  ruleTheme: expect.any(Function),
}

const markdownlintError: LintError = {
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

export {
  expectedResultThemes,
  markdownlintError,
}
