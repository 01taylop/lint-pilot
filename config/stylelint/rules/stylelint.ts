// https://stylelint.io/user-guide/rules

import { REGEX_PATTERNS } from '../constants'

/*
 * Avoid Errors
 */

const descending = {
  'no-descending-specificity': true,
}

const duplicate = {
  'declaration-block-no-duplicate-custom-properties': true,
  'declaration-block-no-duplicate-properties': true,
  'font-family-no-duplicate-names': true,
  'keyframe-block-no-duplicate-selectors': true,
  'no-duplicate-at-import-rules': true,
  'no-duplicate-selectors': true,
}

const empty = {
  'block-no-empty': true,
  'comment-no-empty': true,
  'no-empty-source': true,
}

const invalid = {
  'color-no-invalid-hex': true,
  'function-calc-no-unspaced-operator': true,
  'keyframe-declaration-no-important': true,
  'media-query-no-invalid': true,
  'named-grid-areas-no-invalid': true,
  'no-invalid-double-slash-comments': true,
  'no-invalid-position-at-import-rule': true,
  'string-no-newline': true,
}

const irregular = {
  'no-irregular-whitespace': true,
}

const missing = {
  'custom-property-no-missing-var-function': true,
  'font-family-no-missing-generic-family-keyword': [true, {
    ignoreFontFamilies: [],
  }],
}

const nonStandard = {
  'function-linear-gradient-no-nonstandard-direction': true,
}

const overrides = {
  'declaration-block-no-shorthand-property-overrides': true,
}

const unmatchable = {
  'selector-anb-no-unmatchable': true,
}

const unknown = {
  'annotation-no-unknown': true,
  'at-rule-no-unknown': true,
  'declaration-property-value-no-unknown': true,
  'function-no-unknown': true,
  'media-feature-name-no-unknown': true,
  'media-feature-name-value-no-unknown': true,
  'no-unknown-animations': true,
  'no-unknown-custom-media': true,
  'no-unknown-custom-properties': true,
  'property-no-unknown': true,
  'selector-pseudo-class-no-unknown': true,
  'selector-pseudo-element-no-unknown': true,
  'selector-type-no-unknown': true,
  'unit-no-unknown': true,
}

/*
 * Enforce Conventions
 */

const allowedDisallowedAndRequired = {
  // 'at-rule-allowed-list': [],
  'at-rule-disallowed-list': ['debug'],
  'at-rule-no-vendor-prefix': true,
  // 'at-rule-property-required-list': {},
  'color-hex-alpha': 'never',
  'color-named': 'never',
  // 'color-no-hex': true,
  // 'comment-word-disallowed-list': [],
  // 'declaration-no-important': true,
  // 'declaration-property-unit-allowed-list': {},
  // 'declaration-property-unit-disallowed-list': {},
  // 'declaration-property-value-allowed-list': {},
  'declaration-property-value-disallowed-list': {
    position: ['fixed'],
    transform: ['all'],
  },
  // 'function-allowed-list': [],
  // 'function-disallowed-list': [],
  'function-url-no-scheme-relative': true,
  // 'function-url-scheme-allowed-list': [],
  // 'function-url-scheme-disallowed-list': [],
  'length-zero-no-unit': true,
  // 'media-feature-name-allowed-list': [],
  // 'media-feature-name-disallowed-list': [],
  'media-feature-name-no-vendor-prefix': true,
  // 'media-feature-name-unit-allowed-list': {},
  // 'media-feature-name-value-allowed-list': {},
  // 'property-allowed-list': [],
  'property-disallowed-list': ['font-size', 'opacity', 'text-overflow', 'z-index'],
  'property-no-vendor-prefix': true,
  // 'rule-selector-property-disallowed-list': {},
  // 'selector-attribute-name-disallowed-list': [],
  // 'selector-attribute-operator-allowed-list': [],
  // 'selector-attribute-operator-disallowed-list': [],
  // 'selector-combinator-allowed-list': [],
  // 'selector-combinator-disallowed-list': [],
  // 'selector-disallowed-list': [],
  'selector-no-qualifying-type': true,
  'selector-no-vendor-prefix': true,
  // 'selector-pseudo-class-allowed-list': [],
  // 'selector-pseudo-class-disallowed-list': [],
  // 'selector-pseudo-element-allowed-list': [],
  // 'selector-pseudo-element-disallowed-list': [],
  // 'unit-allowed-list': [],
  // 'unit-disallowed-list': [],
  'value-no-vendor-prefix': true,
}

const caseSensitive = {
  'function-name-case': 'lower',
  'selector-type-case': 'lower',
  'value-keyword-case': ['lower', {
    ignoreProperties: ['font-family', '/^\\$font-family(-{1}.*)*/'], // All scss variables with fonts should be named "font-family-x"
  }],
}

const emptyLines = {
  'at-rule-empty-line-before': ['always', {
    except: ['after-same-name', 'first-nested'],
    ignore: ['after-comment'],
    ignoreAtRules: ['else', 'mixin', 'return', 'warn'],
  }],
  'comment-empty-line-before': ['always', {
    except: ['first-nested'],
    ignore: ['stylelint-commands'],
  }],
  'custom-property-empty-line-before': ['always', {
    except: ['after-comment', 'after-custom-property', 'first-nested'],
  }],
  'declaration-empty-line-before': ['always', {
    except: ['after-comment', 'after-declaration', 'first-nested'],
  }],
  'rule-empty-line-before': ['always', {
    except: ['after-single-line-comment', 'first-nested'],
  }],
}

const maxAndMin = {
  'declaration-block-single-line-max-declarations': 1,
  'declaration-property-max-values': {},
  'max-nesting-depth': [3, {
    ignore: ['blockless-at-rules', 'pseudo-classes'],
    ignoreAtRules: ['media'],
  }],
  'number-max-precision': 2,
  'selector-max-attribute': 2,
  'selector-max-class': 3,
  'selector-max-combinators': 3,
  'selector-max-compound-selectors': 4,
  'selector-max-id': 1,
  'selector-max-pseudo-class': 2,
  // 'selector-max-specificity': '',
  'selector-max-type': 2,
  'selector-max-universal': 1,
  // 'time-min-milliseconds': 100,
}

const notation = {
  'alpha-value-notation': 'number',
  'color-function-notation': 'modern',
  'color-hex-length': 'short',
  'font-weight-notation': ['numeric', {
    ignore: ['relative'],
  }],
  'hue-degree-notation': 'angle',
  'import-notation': 'string',
  'keyframe-selector-notation': 'percentage-unless-within-keyword-only-block',
  'lightness-notation': 'percentage',
  'media-feature-range-notation': 'context',
  'selector-not-notation': 'complex',
  'selector-pseudo-element-colon-notation': 'double',
}

const pattern = {
  // 'comment-pattern': '',
  'custom-media-pattern': REGEX_PATTERNS.KEBAB,
  'custom-property-pattern': REGEX_PATTERNS.KEBAB,
  'keyframes-name-pattern': REGEX_PATTERNS.KEBAB,
  'selector-class-pattern': REGEX_PATTERNS.HYPHENATED_BEM,
  'selector-id-pattern': REGEX_PATTERNS.KEBAB,
  // 'selector-nested-pattern': '',
}

const quotes = {
  'font-family-name-quotes': 'always-where-recommended',
  'function-url-quotes': ['always', {
    except: ['empty'],
  }],
  'selector-attribute-quotes': 'always',
}

const redundant = {
  'declaration-block-no-redundant-longhand-properties': true,
  'shorthand-property-no-redundant-values': true,
}

const whitespaceInside = {
  'comment-whitespace-inside': 'always',
}

/*
 * Export
 */

export default {
  // Avoid Errors
  ...descending,
  ...duplicate,
  ...empty,
  ...invalid,
  ...irregular,
  ...missing,
  ...nonStandard,
  ...overrides,
  ...unmatchable,
  ...unknown,
  // Enforce Conventions
  ...allowedDisallowedAndRequired,
  ...caseSensitive,
  ...emptyLines,
  ...maxAndMin,
  ...notation,
  ...pattern,
  ...quotes,
  ...redundant,
  ...whitespaceInside,
}
