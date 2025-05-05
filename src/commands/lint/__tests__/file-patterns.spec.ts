import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import { getFilePatterns } from '../file-patterns'

describe('getFilePatterns', () => {

  beforeEach(() => {
    jest.spyOn(colourLog, 'config').mockImplementation(() => true)
    jest.spyOn(console, 'log').mockImplementation(() => true)
  })

  it('returns the default file patterns for ESLint', () => {
    const filePatterns = getFilePatterns({})

    const expectedPatterns = [
      '**/*.{cjs,js,jsx,mjs,ts,tsx}',
    ]

    expect(filePatterns.includePatterns[Linter.ESLint]).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('ESLint Patterns', expectedPatterns)
  })

  it('returns the file patterns for ESLint with an additional include pattern', () => {
    const filePatterns = getFilePatterns({
      eslintInclude: 'foo'
    })

    const expectedPatterns = [
      '**/*.{cjs,js,jsx,mjs,ts,tsx}',
      'foo',
    ]

    expect(filePatterns.includePatterns[Linter.ESLint]).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('ESLint Patterns', expectedPatterns)
  })

  it('returns the file patterns for ESLint with several additional include patterns', () => {
    const filePatterns = getFilePatterns({
      eslintInclude: ['foo', 'bar'],
    })

    const expectedPatterns = [
      '**/*.{cjs,js,jsx,mjs,ts,tsx}',
      'foo',
      'bar',
    ]

    expect(filePatterns.includePatterns[Linter.ESLint]).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('ESLint Patterns', expectedPatterns)
  })

  it('returns the default file patterns for Markdownlint', () => {
    const filePatterns = getFilePatterns({})

    const expectedPatterns = [
      '**/*.{md,mdx}',
    ]

    expect(filePatterns.includePatterns[Linter.Markdownlint]).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('Markdownlint Patterns', expectedPatterns)
  })

  it('returns the default file patterns for Stylelint', () => {
    const filePatterns = getFilePatterns({})

    const expectedPatterns = [
      '**/*.{css,scss,less}',
    ]

    expect(filePatterns.includePatterns[Linter.Stylelint]).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('Stylelint Patterns', expectedPatterns)
  })

  it('returns the default ignore file patterns', () => {
    const filePatterns = getFilePatterns({})

    const expectedPatterns = [
      '**/+(coverage|dist|node_modules|tmp|tscOutput|vendor)/**',
      '**/*.+(map|min).*',
    ]

    expect(filePatterns.ignorePatterns).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('Ignore', expectedPatterns)
  })

  it('returns the ignore file patterns with an additional directory ignored', () => {
    const filePatterns = getFilePatterns({
      ignoreDirs: 'foo'
    })

    const expectedPatterns = [
      '**/+(coverage|dist|foo|node_modules|tmp|tscOutput|vendor)/**',
      '**/*.+(map|min).*',
    ]

    expect(filePatterns.ignorePatterns).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('Ignore', expectedPatterns)
  })

  it('returns the ignore file patterns with several additional directories ignored', () => {
    const filePatterns = getFilePatterns({
      ignoreDirs: ['foo', 'bar'],
    })

    const expectedPatterns = [
      '**/+(bar|coverage|dist|foo|node_modules|tmp|tscOutput|vendor)/**',
      '**/*.+(map|min).*',
    ]

    expect(filePatterns.ignorePatterns).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('Ignore', expectedPatterns)
  })

  it('returns the ignore file patterns with an additional pattern ignored', () => {
    const filePatterns = getFilePatterns({
      ignorePatterns: 'foo'
    })

    const expectedPatterns = [
      '**/+(coverage|dist|node_modules|tmp|tscOutput|vendor)/**',
      '**/*.+(map|min).*',
      'foo',
    ]

    expect(filePatterns.ignorePatterns).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('Ignore', expectedPatterns)
  })

  it('returns the ignore file patterns with several additional patterns ignored', () => {
    const filePatterns = getFilePatterns({
      ignorePatterns: ['foo', 'bar'],
    })

    const expectedPatterns = [
      '**/+(coverage|dist|node_modules|tmp|tscOutput|vendor)/**',
      '**/*.+(map|min).*',
      'bar',
      'foo',
    ]

    expect(filePatterns.ignorePatterns).toStrictEqual(expectedPatterns)
    expect(colourLog.config).toHaveBeenCalledWith('Ignore', expectedPatterns)
  })

})
