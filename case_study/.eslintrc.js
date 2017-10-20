module.exports = {
  'extends': ['eslint:recommended', 'google'],
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'rules': {
      'semi': ['off'],
      'require-jsdoc': ['off'],
      'no-undef': ['off'],
  },
}