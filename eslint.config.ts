import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sharedFiles = ['app/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'];

export default tseslint.config([
  globalIgnores(['.react-router/']),
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    files: sharedFiles,
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      import: pluginImport,
      'unused-imports': unusedImports,
      ...pluginReact.configs.flat.recommended.plugins,
      ...pluginReact.configs.flat['jsx-runtime'].plugins,
      ...eslintPluginUnicorn.configs.recommended.plugins,
    },
    rules: {
      // Typescript styling
      '@typescript-eslint/naming-convention': [
        'error',
        // Variables: camelCase, UPPER_CASE for constants
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        // Classes, Interfaces, Types, Enums: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          prefix: ['T'],
        },

        // Interfaces: PascalCase with "I" prefix
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: true,
          },
        },
        // Properties (can vary; relaxed here)
        {
          selector: 'property',
          format: null,
        },
      ],

      // Unused imports/vars
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Import rules
      'import/no-absolute-path': 'error',

      // Console logging
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // React + Unicorn + Prettier rules
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReact.configs.flat['jsx-runtime'].rules,
      ...eslintPluginUnicorn.configs.recommended.rules,

      'unicorn/no-null': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/switch-case-braces': 'off',
    },
  },
  prettier,
]);
