// https://stylelint.io/user-guide/rules

import { REGEX_PATTERNS } from '../constants'

/*
 * Possible errors
 */

const possibleErrors = {
  'annotation-no-unknown': true,
  'at-rule-no-unknown': true,
  'block-no-empty': true,
  'color-no-invalid-hex': true,
  'comment-no-empty': true,
  'custom-property-no-missing-var-function': true,
  'declaration-block-no-duplicate-custom-properties': true,
  'declaration-block-no-duplicate-properties': true,
  'declaration-block-no-shorthand-property-overrides': true,
  'font-family-no-duplicate-names': true,
  'font-family-no-missing-generic-family-keyword': true,
  'function-calc-no-unspaced-operator': true,
  'function-linear-gradient-no-nonstandard-direction': true,
  'keyframe-declaration-no-important': true,
  'media-feature-name-no-unknown': true,
  'named-grid-areas-no-invalid': true,
  'no-descending-specificity': true,
  'no-duplicate-at-import-rules': true,
  'no-duplicate-selectors': true,
  'no-empty-source': true,
  'no-invalid-double-slash-comments': true,
  'no-invalid-position-at-import-rule': true,
  'property-no-unknown': true,
  'selector-pseudo-class-no-unknown': true,
  'selector-pseudo-element-no-unknown': true,
  'selector-type-no-unknown': true,
  'string-no-newline': true,
  'unit-no-unknown': true,
}

/*
 * Limit language features
 */

const limitLanguageFeatures = {
  'alpha-value-notation': 'number',
  // 'at-rule-allowed-list': false,
  'at-rule-disallowed-list': ['debug'],
  'at-rule-no-vendor-prefix': true,
  // 'at-rule-property-required-list': false,
  'color-function-notation': 'modern',
  'color-hex-alpha': 'never',
  'color-named': 'never',
  // 'color-no-hex': false,
  // 'comment-pattern': false,
  // 'comment-word-disallowed-list': false,
  'custom-media-pattern': REGEX_PATTERNS.KEBAB,
  'custom-property-pattern': REGEX_PATTERNS.KEBAB,
  'declaration-block-no-redundant-longhand-properties': true,
  'declaration-block-single-line-max-declarations': 1,
  // 'declaration-no-important': false,
  // 'declaration-property-unit-allowed-list': false,
  // 'declaration-property-unit-disallowed-list': false,
  // 'declaration-property-value-allowed-list': false,
  'declaration-property-value-disallowed-list': {
    transform: ['all'],
  },
  'font-weight-notation': 'numeric',
  // 'function-allowed-list': false,
  // 'function-disallowed-list': false,
  'function-url-no-scheme-relative': true,
  // 'function-url-scheme-allowed-list': false,
  // 'function-url-scheme-disallowed-list': false,
  'hue-degree-notation': 'angle',
  'keyframe-selector-notation': 'percentage-unless-within-keyword-only-block',
  'keyframes-name-pattern': REGEX_PATTERNS.KEBAB,
  'length-zero-no-unit': true,
  'max-nesting-depth': [3, {
    ignore: ['blockless-at-rules', 'pseudo-classes'],
  }],
  // 'media-feature-name-allowed-list': false,
  // 'media-feature-name-disallowed-list': false,
  'media-feature-name-no-vendor-prefix': true,
  // 'media-feature-name-value-allowed-list': false,
  'no-unknown-animations': true,
  'number-max-precision': 2,
  // 'property-allowed-list': false,
  'property-disallowed-list': ['font-size', 'opacity', 'text-overflow', 'z-index'],
  'property-no-vendor-prefix': true,
  // 'rule-selector-property-disallowed-list': false,
  // 'selector-attribute-name-disallowed-list': false,
  // 'selector-attribute-operator-allowed-list': false,
  // 'selector-attribute-operator-disallowed-list': false,
  'selector-class-pattern': REGEX_PATTERNS.HYPHENATED_BEM,
  // 'selector-combinator-allowed-list': false,
  // 'selector-combinator-disallowed-list': false,
  // 'selector-disallowed-list': false,
  'selector-id-pattern': REGEX_PATTERNS.KEBAB,
  'selector-max-attribute': 1,
  'selector-max-class': 3,
  'selector-max-combinators': 3,
  'selector-max-compound-selectors': 4,
  'selector-max-id': 1,
  'selector-max-pseudo-class': 2,
  // 'selector-max-specificity': false,
  'selector-max-type': 2,
  'selector-max-universal': 1,
  // 'selector-nested-pattern': false,
  'selector-no-qualifying-type': true,
  'selector-no-vendor-prefix': true,
  // 'selector-pseudo-class-allowed-list': false,
  // 'selector-pseudo-class-disallowed-list': false,
  // 'selector-pseudo-element-allowed-list': false,
  'selector-pseudo-element-colon-notation': 'double',
  // 'selector-pseudo-element-disallowed-list': false,
  'shorthand-property-no-redundant-values': true,
  // 'time-min-milliseconds': false,
  // 'unit-allowed-list': false,
  // 'unit-disallowed-list': false,
  'value-no-vendor-prefix': true,
}

/*
 * Stylistic issues
 */

const stylisticIssues = {
  'at-rule-empty-line-before': ['always', {
    except: ['after-same-name', 'first-nested'],
    ignore: ['after-comment'],
    ignoreAtRules: ['else', 'mixin', 'return', 'warn'],
  }],
  'color-hex-length': 'short',
  'comment-empty-line-before': ['always', {
    except: ['first-nested'],
  }],
  'comment-whitespace-inside': 'always',
  'custom-property-empty-line-before': ['always', {
    except: ['after-comment', 'after-custom-property', 'first-nested'],
  }],
  'declaration-empty-line-before': ['always', {
    except: ['after-comment', 'after-declaration', 'first-nested'],
  }],
  'font-family-name-quotes': 'always-where-required',
  'function-name-case': 'lower',
  'function-url-quotes': 'always',
  'no-irregular-whitespace': true,
  'rule-empty-line-before': ['always', {
    ignore: ['after-comment', 'first-nested'],
  }],
  'selector-attribute-quotes': 'always',
  'selector-type-case': 'lower',
  'value-keyword-case': ['lower', {
    ignoreProperties: ['font-family', '/^\\$font-family(-{1}.*)*/'], // all scss variables with fonts should be named either "font-family" or "font-family-x"
  }],
}

export default {
  ...possibleErrors,
  ...limitLanguageFeatures,
  ...stylisticIssues,
}
