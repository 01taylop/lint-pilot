"array-element-newline": ["error", { "multiline": true, "minItems": 2 }],
    "object-curly-newline": [
      "error",
      {
        "ObjectExpression": { "multiline": true, "minProperties": 2 },
        "ObjectPattern": { "multiline": true, "minProperties": 2 },
        "ImportDeclaration": "never",
        "ExportDeclaration": { "multiline": true, "minProperties": 2 }
      }
    ],
    "object-property-newline": ["error", { "allowMultiplePropertiesPerLine": false }]
