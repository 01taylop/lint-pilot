// https://github.com/stylelint-scss/stylelint-scss

import { REGEX_PATTERNS } from '../constants'

export default {
  'scss/at-each-key-value-single-line': true,
  'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
  'scss/at-else-closing-brace-space-after': 'always-intermediate',
  'scss/at-else-empty-line-before': 'never',
  'scss/at-else-if-parentheses-space-before': 'always',
  'scss/at-extend-no-missing-placeholder': true,
  // 'scss/at-function-named-arguments': ['always', {
  //   ignore: ['single-argument'],
  //   ignoreFunctions: [],
  // }],
  'scss/at-function-parentheses-space-before': 'never',
  'scss/at-function-pattern': [REGEX_PATTERNS.KEBAB, {
    message: 'Expected function name to be kebab-case',
  }],
  'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
  'scss/at-if-closing-brace-space-after': 'always-intermediate',
  'scss/at-if-no-null': true,
  // 'scss/at-import-partial-extension-allowed-list': [],
  // 'scss/at-import-partial-extension-disallowed-list': [],
  'scss/at-mixin-argumentless-call-parentheses': 'never',
  // 'scss/at-mixin-named-arguments': ['always', {
  //   ignore: ['single-argument'],
  // }],
  'scss/at-mixin-no-risky-nesting-selector': true,
  'scss/at-mixin-parentheses-space-before': 'never',
  'scss/at-mixin-pattern': [REGEX_PATTERNS.KEBAB, {
    message: 'Expected mixin name to be kebab-case',
  }],
  'scss/at-root-no-redundant': true,
  'scss/at-rule-conditional-no-parentheses': true,
  'scss/at-rule-no-unknown': true,
  'scss/at-use-no-redundant-alias': true,
  'scss/at-use-no-unnamespaced': true,
  'scss/block-no-redundant-nesting': true, // This rule might need to be disabled when writing overriding styles. In such cases, it is recommended to disable the rule in the file to make it clear that the nesting is intentional.
  'scss/comment-no-empty': true,
  'scss/comment-no-loud': true,
  'scss/declaration-nested-properties': 'never',
  'scss/declaration-nested-properties-no-divided-groups': true,
  // 'scss/declaration-property-value-no-unknown': true, // Experimental
  'scss/dimension-no-non-numeric-values': true,
  'scss/dollar-variable-colon-newline-after': 'always-multi-line',
  'scss/dollar-variable-colon-space-after': 'always-single-line',
  'scss/dollar-variable-colon-space-before': 'never',
  'scss/dollar-variable-default': [true, {
    ignore: 'local',
  }],
  'scss/dollar-variable-empty-line-after': ['always', {
    except: ['before-dollar-variable'],
    ignore: ['before-comment'],
  }],
  'scss/dollar-variable-empty-line-before': ['always', {
    except: ['after-dollar-variable', 'first-nested'],
    ignore: ['after-comment'],
  }],
  'scss/dollar-variable-first-in-block': [true, {
    ignore: ['comments', 'imports'],
  }],
  'scss/dollar-variable-no-missing-interpolation': true,
  'scss/dollar-variable-no-namespaced-assignment': true,
  'scss/dollar-variable-pattern': [REGEX_PATTERNS.KEBAB, {
    message: 'Expected variable name to be kebab-case',
  }],
  'scss/double-slash-comment-empty-line-before': ['always', {
    except: ['first-nested'],
    ignore: ['between-comments', 'stylelint-commands'],
  }],
  // 'scss/double-slash-comment-inline': 'always',
  'scss/double-slash-comment-whitespace-inside': 'always',
  'scss/function-calculation-no-interpolation': true,
  'scss/function-color-relative': true,
  // 'scss/function-disallowed-list': [],
  'scss/function-no-unknown': true,
  'scss/function-quote-no-quoted-strings-inside': true,
  'scss/function-unquote-no-unquoted-strings-inside': true,
  'scss/load-no-partial-leading-underscore': true,
  'scss/load-partial-extension': 'never',
  // 'scss/map-keys-quotes': 'always',
  'scss/media-feature-value-dollar-variable': ['always', {
    ignore: ['keywords'],
  }],
  // 'scss/no-dollar-variables': true,
  'scss/no-duplicate-dollar-variables': true,
  'scss/no-duplicate-mixins': true,
  'scss/no-global-function-names': true,
  'scss/no-unused-private-members': true,
  'scss/operator-no-newline-after': true,
  'scss/operator-no-newline-before': true,
  'scss/operator-no-unspaced': true,
  'scss/partial-no-import': true,
  'scss/percent-placeholder-pattern': [REGEX_PATTERNS.KEBAB, {
    message: 'Expected placeholder name to be kebab-case',
  }],
  'scss/property-no-unknown': true,
  // 'scss/selector-nest-combinators': 'always',
  'scss/selector-no-redundant-nesting-selector': true,
  // 'scss/selector-no-union-class-name': false,
}
