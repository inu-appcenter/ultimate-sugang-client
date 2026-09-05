import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.claude', 'intake', 'harness']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      // rules/architecture.md: import 는 절대경로 alias `@/` 만 (상대경로 금지)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['./*', '../*'], message: "상대경로 import 금지 — '@/…' alias 만 사용" },
          ],
        },
      ],
    },
  },
])
