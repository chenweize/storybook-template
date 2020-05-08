const path = require('path');
const startMockServer = require('../mocks/server');

// 运行Mock服务器
startMockServer();

module.exports = {
	stories: [ '../stories/**/*.stories.(js|mdx)' ],
	addons: [
		'@storybook/addon-viewport',
		'@storybook/addon-docs',
		'@storybook/addon-actions',
		'@storybook/addon-knobs',
		'@storybook/addon-links',
		'@storybook/addon-backgrounds',
		'@storybook/addon-notes',
		'@storybook/preset-scss',
		// '@storybook/addon-jest',
		// '@storybook/addon-centered'
		// '@storybook/addon-contexts'
		// '@storybook/addon-storysource'
	],
	webpackFinal: async (config, { configType }) => {
		// `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
		// You can change the configuration based on that.
		// 'PRODUCTION' is used when building the static version of storybook.

		// Make whatever fine-grained changes you need
		config.module.rules.push({
			test: /\.scss$/,
			use: [ 'style-loader', 'css-loader', 'sass-loader' ],
			include: path.resolve(__dirname, '../')
		});
		return config;
	}
};
