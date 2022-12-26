module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'google'
  ],
  'globals': {
    'Ext': 'readonly',
    'JSON5': 'readonly',
    'Coon': 'writable',
  },
  'parserOptions': {
    ecmaVersion: 8,
  },
  'rules': {
    'max-len': [
      'error',
      150
    ],
    'indent': [
      'warning',
      2
    ],
	'linebreak-style' : 'crlf',
    'prefer-const': 'error',
    'no-const-assign': 'error',
    'guard-for-in': ['off'],
    'valid-jsdoc': ['off'],
    'prefer-rest-params': ['off'],
    'prefer-spread': ['off'],
    'new-cap': ['off', {'newIsCap': false}],
    'semi': ['error', 'always'],
    'curly': ['error', 'all'],
    'comma-dangle': ['error', {
      'arrays': 'never',
      'objects': 'always-multiline',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never',
    }],
    'camelcase': 0,
    'no-undef': ['error'],
  },
};
