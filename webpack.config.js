const webpackMerge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const commonPartial = require('./webpack/webpack.common');
const serverPartial = require('./webpack/webpack.server');
const prodPartial = require('./webpack/webpack.prod');

module.exports = (options, webpackOptions) => {
	options = options || {};

	const serverConfig = webpackMerge({}, commonPartial, serverPartial, {
		mode: 'development',
		entry: serverPartial.entry, // Temporary
		plugins: [
			new NodemonPlugin()
		],
		externals: [nodeExternals({
			modulesFromFile: true
		})]
	});

	const configs = [];

	configs.push(serverConfig);

	return configs;
}
