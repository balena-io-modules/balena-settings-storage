const getKarmaConfig = require('balena-config-karma');
const packageJSON = require('./package.json');

module.exports = (config) => {
	const karmaConfig = getKarmaConfig(packageJSON);
	// polyfill required for balena-settings-client
	karmaConfig.webpack.resolve.fallback = {
		fs: false,
		os: false,
		path: false,
		process: false,
		util: false,
	};

	config.set(karmaConfig);
};
