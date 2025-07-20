import { expectedResultThemes, markdownlintError } from '@Jest/testData'

import { processResults } from '../process-results'

import type { LintResults } from 'markdownlint'

describe('processResults', () => {

  it('returns results and a summary when there are no lint results', () => {
    const report = processResults({})

    expect(report).toStrictEqual({
      results: {},
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'Markdownlint',
        warningCount: 0,
      },
    })
  })

  it('returns results and a summary when there are no errors', () => {
    const lintResults: LintResults = {
      'README.md': [],
    }

    const report = processResults(lintResults)

    expect(report).toStrictEqual({
      results: {},
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'Markdownlint',
        warningCount: 0,
      },
    })
  })

  it('returns results sorted by lineNumber and a summary when there are errors', () => {
    const lintResults: LintResults = {
      // No errors
      'CHANGELOG.md': [],
      'CONTRIBUTING.md': [markdownlintError],
      // 5 errors
      'README.md': [{
        ...markdownlintError,
        lineNumber: 7,
        errorRange: [],
        ruleDescription: 'no-error-range',
      }, {
        ...markdownlintError,
        errorDetail: '',
        fixInfo: undefined,
        lineNumber: 9,
        ruleDescription: 'no-error-detail',
      }, {
        ...markdownlintError,
        fixInfo: undefined,
        lineNumber: 13,
        ruleNames: ['MD000', 'test-rule-b'],
        ruleDescription: 'sorted-by-name',
      }, {
        ...markdownlintError,
        fixInfo: undefined,
        lineNumber: 13,
        ruleNames: ['MD000', 'test-rule-a'],
        ruleDescription: 'sorted-by-name',
      }, {
        ...markdownlintError,
        fixInfo: undefined,
        errorDetail: '',
        lineNumber: 3,
        ruleDescription: 'sort-by-line-number',
      }],
    }

    const report = processResults(lintResults)

    expect(report).toStrictEqual({
      results: {
        'CONTRIBUTING.md': [{
          ...expectedResultThemes,
          message: 'test-rule-description: test-error-detail',
          position: '1:1',
          rule: 'test-rule-name',
          severity: '  ×',
        }],
        'README.md': [{
          ...expectedResultThemes,
          message: 'sort-by-line-number',
          position: '3:1',
          rule: 'test-rule-name',
          severity: '  ×',
        }, {
          ...expectedResultThemes,
          message: 'no-error-range: test-error-detail',
          position: '7',
          rule: 'test-rule-name',
          severity: '  ×',
        }, {
          ...expectedResultThemes,
          message: 'no-error-detail',
          position: '9:1',
          rule: 'test-rule-name',
          severity: '  ×',
        }, {
          ...expectedResultThemes,
          message: 'sorted-by-name: test-error-detail',
          position: '13:1',
          rule: 'test-rule-a',
          severity: '  ×',
        }, {
          ...expectedResultThemes,
          message: 'sorted-by-name: test-error-detail',
          position: '13:1',
          rule: 'test-rule-b',
          severity: '  ×',
        }],
      },
      summary: {
        deprecatedRules: [],
        errorCount: 6,
        fileCount: 3,
        fixableErrorCount: 2,
        fixableWarningCount: 0,
        linter: 'Markdownlint',
        warningCount: 0,
      },
    })
  })

})
