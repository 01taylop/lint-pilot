import path from 'node:path'

import { expectedResultThemes } from '@Jest/testData'

import { processResults } from '../process-results'

import type { ESLint, Linter } from 'eslint'

describe('processResults', () => {

  const commonResult: ESLint.LintResult = {
    errorCount: 0,
    fatalErrorCount: 0,
    filePath: path.join(process.cwd(), 'file.js'),
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    messages: [],
    suppressedMessages: [],
    usedDeprecatedRules: [],
    warningCount: 0,
  }

  const commonMessage: Linter.LintMessage = {
    column: 1,
    line: 1,
    message: 'Test message',
    ruleId: 'test-rule',
    severity: 2,
  }

  it('returns a report when there are no results', () => {
    const report = processResults([])

    expect(report).toStrictEqual({
      results: {},
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'ESLint',
        warningCount: 0,
      },
    })
  })

  it('normalises file paths relative to the cwd', () => {
    const report = processResults([{
      ...commonResult,
      filePath: path.join(process.cwd(), 'file.js'),
      messages: [commonMessage],
    }])

    expect(report).toStrictEqual({
      results: {
        'file.js': expect.any(Array),
      },
      summary: expect.objectContaining({
        fileCount: 1,
      }),
    })
  })

  it('does not report results for files which have no messages', () => {
    const report = processResults([{
      ...commonResult,
      filePath: path.join(process.cwd(), 'file.js'),
      messages: [commonMessage],
    }, {
      ...commonResult,
      filePath: path.join(process.cwd(), 'file-2.js'),
      messages: [],
    }])

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
      errorCount: 2,
      filePath: path.join(process.cwd(), 'file.js'),
      fixableErrorCount: 1,
      fixableWarningCount: 1,
      messages: [commonMessage],
      warningCount: 3,
    }, {
      ...commonResult,
      errorCount: 1,
      filePath: path.join(process.cwd(), 'file-2.js'),
      fixableErrorCount: 0,
      fixableWarningCount: 1,
      messages: [commonMessage],
      warningCount: 1,
    }])

    expect(report).toStrictEqual({
      results: {
        'file.js': expect.any(Array),
        'file-2.js': expect.any(Array),
      },
      summary: {
        deprecatedRules: [],
        errorCount: 3,
        fileCount: 2,
        fixableErrorCount: 1,
        fixableWarningCount: 2,
        linter: 'ESLint',
        warningCount: 4,
      },
    })
  })

  it('formats warning messages', () => {
    const report = processResults([{
      ...commonResult,
      filePath: path.join(process.cwd(), 'file.js'),
      messages: [{
        column: 2,
        line: 3,
        message: 'Test warning',
        ruleId: 'test-warning',
        severity: 1,
      }],
      warningCount: 1,
    }])

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
        linter: 'ESLint',
        warningCount: 1,
      },
    })
  })

  it('formats error messages', () => {
    const report = processResults([{
      ...commonResult,
      errorCount: 1,
      filePath: path.join(process.cwd(), 'file.js'),
      messages: [{
        column: 10,
        line: 8,
        message: 'Test error',
        ruleId: 'test-error',
        severity: 2,
      }],
    }])

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
        linter: 'ESLint',
        warningCount: 0,
      },
    })
  })

  it('returns a "core-error" when ruleId is null', () => {
    const report = processResults([{
      ...commonResult,
      errorCount: 1,
      filePath: path.join(process.cwd(), 'file.js'),
      messages: [{
        column: 1,
        line: 1,
        message: 'Unknown error',
        ruleId: null,
        severity: 2,
      }],
    }])

    expect(report).toStrictEqual({
      results: {
        'file.js': [{
          ...expectedResultThemes,
          position: '1:1',
          message: 'Unknown error',
          rule: 'core-error',
          severity: '  ×',
        }],
      },
      summary: {
        deprecatedRules: [],
        errorCount: 1,
        fileCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'ESLint',
        warningCount: 0,
      },
    })
  })

  it('accumulates deprecated rules without duplicates', () => {
    const report = processResults([{
      ...commonResult,
      filePath: path.join(process.cwd(), 'file.js'),
      messages: [commonMessage],
      usedDeprecatedRules: [{
        replacedBy: [],
        ruleId: 'deprecated-rule-1',
      }, {
        replacedBy: [],
        ruleId: 'deprecated-rule-2',
      }],
    }, {
      ...commonResult,
      filePath: path.join(process.cwd(), 'file-2.js'),
      messages: [commonMessage],
      usedDeprecatedRules: [{
        replacedBy: [],
        ruleId: 'deprecated-rule-1',
      }],
    }])

    expect(report).toStrictEqual({
      results: {
        'file.js': expect.any(Array),
        'file-2.js': expect.any(Array),
      },
      summary: {
        deprecatedRules: ['deprecated-rule-1', 'deprecated-rule-2'],
        errorCount: 0,
        fileCount: 2,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'ESLint',
        warningCount: 0,
      },
    })
  })

})
