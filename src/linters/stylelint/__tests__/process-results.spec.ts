import path from 'node:path'

import { expectedResultThemes } from '@Jest/testData'

import { processResults } from '../process-results'

import type { LintResult, Warning } from 'stylelint'

describe('processResults', () => {

  const commonResult: LintResult = {
    deprecations: [],
    errored: false,
    ignored: false,
    invalidOptionWarnings: [],
    parseErrors: [],
    source: path.join(process.cwd(), 'file.js'),
    warnings: [],
  }

  const commonWarning: Warning = {
    column: 1,
    line: 1,
    rule: 'test-rule',
    severity: 'error',
    text: 'Test warning',
  }

  it('returns a report when there are no results', () => {
    const report = processResults([], {})

    expect(report).toStrictEqual({
      results: {},
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'Stylelint',
        warningCount: 0,
      },
    })
  })

  it('normalises file paths relative to the cwd', () => {
    const report = processResults([{
      ...commonResult,
      source: path.join(process.cwd(), 'file.js'),
      warnings: [commonWarning],
    }], {})

    expect(report).toStrictEqual({
      results: {
        'file.js': expect.any(Array),
      },
      summary: expect.objectContaining({
        fileCount: 1,
      }),
    })
  })

  it('does not report results for files which have no warnings', () => {
    const report = processResults([{
      ...commonResult,
      source: path.join(process.cwd(), 'file.js'),
      warnings: [commonWarning],
    }, {
      ...commonResult,
      source: path.join(process.cwd(), 'file-2.js'),
      warnings: [],
    }], {})

    expect(report).toStrictEqual({
      results: {
        'file.js': expect.any(Array),
      },
      summary: expect.objectContaining({
        fileCount: 2,
      }),
    })
  })

  it('aggregates error and warning counts', () => {
    const report = processResults([{
      ...commonResult,
      source: path.join(process.cwd(), 'file.js'),
      warnings: [
        { ...commonWarning, severity: 'error' },
        { ...commonWarning, severity: 'warning' }
      ],
    }, {
      ...commonResult,
      source: path.join(process.cwd(), 'file-2.js'),
      warnings: [
        { ...commonWarning, severity: 'error', rule: 'fixable-rule' },
        { ...commonWarning, severity: 'error' },
      ],
    }, {
      ...commonResult,
      source: path.join(process.cwd(), 'file-3.js'),
      warnings: [
        { ...commonWarning, severity: 'error', rule: 'fixable-rule' },
        { ...commonWarning, severity: 'warning', rule: 'fixable-rule' },
      ],
    }], {
      'fixable-rule': { fixable: true },
    })

    expect(report).toStrictEqual({
      results: {
        'file.js': expect.any(Array),
        'file-2.js': expect.any(Array),
        'file-3.js': expect.any(Array),
      },
      summary: {
        deprecatedRules: [],
        errorCount: 4,
        fileCount: 3,
        fixableErrorCount: 2,
        fixableWarningCount: 1,
        linter: 'Stylelint',
        warningCount: 2,
      },
    })
  })

  it('formats warning messages', () => {
    const report = processResults([{
      ...commonResult,
      source: path.join(process.cwd(), 'file.js'),
      warnings: [{
        column: 2,
        line: 3,
        rule: 'test-warning',
        severity: 'warning',
        text: '(test-warning) Test warning',
      }],
    }], {})

    expect(report).toStrictEqual({
      results: {
        'file.js': [{
          ...expectedResultThemes,
          position: '3:2',
          message: 'Test warning',
          rule: 'test-warning',
          severity: '  ⚠',
        }],
      },
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'Stylelint',
        warningCount: 1,
      },
    })
  })

  it('formats error messages', () => {
    const report = processResults([{
      ...commonResult,
      source: path.join(process.cwd(), 'file.js'),
      warnings: [{
        column: 10,
        line: 8,
        rule: 'test-error',
        severity: 'error',
        text: '(test-error) Test error',
      }],
    }], {})

    expect(report).toStrictEqual({
      results: {
        'file.js': [{
          ...expectedResultThemes,
          position: '8:10',
          message: 'Test error',
          rule: 'test-error',
          severity: '  ×',
        }],
      },
      summary: {
        deprecatedRules: [],
        errorCount: 1,
        fileCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'Stylelint',
        warningCount: 0,
      },
    })
  })

  it('accumulates deprecated rules without duplicates', () => {
    const report = processResults([{
      ...commonResult,
      deprecations: [{
        text: 'deprecated-rule-1',
      }, {
        text: 'deprecated-rule-2',
      }],
      source: path.join(process.cwd(), 'file.js'),
      warnings: [commonWarning],
    }, {
      ...commonResult,
      deprecations: [{
        text: 'deprecated-rule-1',
      }],
      source: path.join(process.cwd(), 'file-2.js'),
      warnings: [commonWarning],
    }], {})

    expect(report).toStrictEqual({
      results: {
        'file.js': expect.any(Array),
        'file-2.js': expect.any(Array),
      },
      summary: {
        deprecatedRules: ['deprecated-rule-1', 'deprecated-rule-2'],
        errorCount: 2,
        fileCount: 2,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'Stylelint',
        warningCount: 0,
      },
    })
  })

})
