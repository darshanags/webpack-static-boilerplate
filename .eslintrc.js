const env = (process.env.NODE_ENV === 'production') ? process.env.NODE_ENV : 'development';
let envSettings = new Map();

// set defaults
envSettings.set("no-console", 0);

// override if environment is set to production
if (env === 'production') {
	envSettings.set("no-console", 2);
}


module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 2015,
		"sourceType": "module"
	},
	"rules": {
		"indent": [
			"error",
			"tab",
			{ "SwitchCase": 1 }
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		"no-console": envSettings.get('no-console')
	},
	"globals": {
		"DOMAIN": true
	}
};