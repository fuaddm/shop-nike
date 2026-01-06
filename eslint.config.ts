import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
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
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettier,
]);
