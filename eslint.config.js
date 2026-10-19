import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser }
    },
    settings: { react: { version: '18.3' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
      // El runtime automático de JSX hace innecesario importar React.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Las reglas de TypeScript cubren los casos donde el tipo se conoce.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'none', varsIgnorePattern: '^_' }
      ]
    }
  },
  {
    // Ficheros de configuración y scripts: se ejecutan en Node, no en el navegador.
    files: ['*.config.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node }
    }
  }
]
