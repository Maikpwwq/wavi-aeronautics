import nextPlugin from '@next/eslint-plugin-next'

export default [
  {
    files: ['src/**/*.{js,jsx,mjs,cjs}'],
    plugins: {
      '@next/next': nextPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off'
    }
  },
  {
    ignores: ['.next/', 'node_modules/', 'reports/', '.stryker-tmp/']
  }
]
