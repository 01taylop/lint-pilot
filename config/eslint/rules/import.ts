// https://github.com/benmosher/eslint-plugin-import

const helpfulWarnings = {
  'import/export': 2,
  'import/no-deprecated': 2,
  'import/no-empty-named-blocks': 2,
  'import/no-extraneous-dependencies': 2,
  'import/no-mutable-exports': 2,
  'import/no-named-as-default': 2,
  'import/no-named-as-default-member': 2,
  'import/no-unused-modules': 2,
}

const moduleSystems = {
  'import/no-amd': 2,
  'import/no-commonjs': 2,
  'import/no-import-module-exports': 2,
  'import/no-nodejs-modules': 0,
  'import/unambiguous': 2,
}

const staticAnalysis = {
  'import/default': 2,
  'import/named': 2,
  'import/namespace': 2,
  'import/no-absolute-path': 2,
  'import/no-cycle': 2,
  'import/no-dynamic-require': 2,
  'import/no-internal-modules': 0,
  'import/no-relative-packages': 2,
  'import/no-relative-parent-imports': 2,
  'import/no-restricted-paths': 0,
  'import/no-self-import': 2,
  'import/no-unresolved': 2,
  'import/no-useless-path-segments': 2,
  'import/no-webpack-loader-syntax': 2,
}

const styleGuide = {
  'import/consistent-type-specifier-style': [2, 'prefer-top-level'],
  'import/dynamic-import-chunkname': [2, {
    allowEmpty: true,
  }],
  'import/exports-last': 2,
  'import/extensions': [2, 'never', {
    json: 'always',
    scss: 'always',
  }],
  'import/first': [2, 'absolute-first'],
  'import/group-exports': 2,
  'import/max-dependencies': [1, {
    ignoreTypeImports: true,
    max: 10,
  }],
  'import/newline-after-import': 2,
  'import/no-anonymous-default-export': 2,
  'import/no-default-export': 0,
  'import/no-duplicates': 2,
  'import/no-named-default': 2,
  'import/no-named-export': 0,
  'import/no-namespace': 2,
  'import/no-unassigned-import': [2, {
    allow: ['**/*.css', '**/*.scss'],
  }],
  'import/order': [2, {
    'alphabetize': {
      order: 'asc',
    },
    'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
    'newlines-between': 'always',
    'pathGroups': [],
    'pathGroupsExcludedImportTypes': [],
  }],
  'import/prefer-default-export': 0,
}

export default {
  ...staticAnalysis,
  ...helpfulWarnings,
  ...moduleSystems,
  ...styleGuide,
}
