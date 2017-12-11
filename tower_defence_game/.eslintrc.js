module.exports = {
	'extends': 'airbnb-base',
	'parserOptions': {
		'ecmaVersion': 2017,
		'sourceType': 'module',
		'ecmaFeatures': {
			'jsx': true,
		},
	},
	'rules': {
		'semi': ['off'],
		'require-jsdoc': ['off'],
		'no-undef': ['off'],
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'no-tabs': 0,
		'no-underscore-dangle': 0,
	},
}