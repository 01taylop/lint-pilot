# ✈️ Lint Pilot

[![CodeQL Analysis](https://github.com/01taylop/lint-pilot/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/01taylop/lint-pilot/actions/workflows/codeql-analysis.yml)

## 🚧 Coming Soon

Lint Pilot is currently under construction. Stay tuned for more information.

## Markdown Lint

Lint Pilot integrates with the popular [markdownlint](https://github.com/DavidAnson/markdownlint) plugin to ensure your Markdown files adhere to best practices and your specified style guide.

### Default Rules

Lint Pilot uses a set of default rules for Markdown linting, which can be found [here](./config/markdownlint.json). These rules are designed to cover a wide range of common Markdown issues, providing a solid foundation for most projects.

### Customising Rules

To customise or extend the default rules provided by Lint Pilot or markdownlint, you can create a `.markdownlint.json` file in your project root. This file allows you to modify existing rules or add new ones to fit your project's needs.

The default rules set by Lint Pilot are located at `node_modules/lint-pilot/markdownlint.json`. To extend these rules, reference them in your `.markdownlint.json` file and then override or add to them as needed. For example:

```json
{
  "extends": "./node_modules/lint-pilot/markdownlint.json",
  "MD013": true, // Enable line length check
}

If you prefer to start with the default settings from markdownlint, ensure your configuration file includes `"default": true`. This will apply markdownlint's standard rules, which you can then extend or override:

```json
{
  "default": true,
  "MD013": false, // Disable line length check
}
```
