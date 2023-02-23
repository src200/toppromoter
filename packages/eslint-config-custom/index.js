module.exports = {
  plugins: [
    'react'
  ],
  extends: [
    'next',
    'turbo',
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'quotes': [2, 'single', { 'avoidEscape': true }],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/jsx-key': 'off',
    'react/jsx-props-no-multi-spaces': 'error',
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-curly-spacing': ['error', { 'when': 'always', 'children': true }],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-max-props-per-line': ['error', { 'when': 'multiline' }],
    'react/jsx-closing-bracket-location': ['error', { 'selfClosing': 'tag-aligned', 'nonEmpty': 'after-props' }],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-one-expression-per-line': ['error', { 'allow': 'none' }],
    'react/jsx-wrap-multilines': ['error', { 'declaration': true, 'assignment': true, 'return': true }],
    'react/jsx-fragments': ['error', 'syntax'],
    'react/jsx-tag-spacing': ['error', {
      'closingSlash': 'never',
      'beforeSelfClosing': 'always',
      'afterOpening': 'never',
      'beforeClosing': 'never'
    }],
    'react/prop-types': 'off'
  }
};