module.exports = {
	env: {
		browser: true,
		es6: true
	},
	extends: [ 'plugin:prettier/recommended', 'prettier', 'plugin:vue/essential' ],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	plugins: [ 'vue' ],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
	}
};
