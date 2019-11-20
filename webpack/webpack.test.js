const webpackMerge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const serverPartial = require('./webpack.server');
const commonPartial = require('./webpack.common');

const options = {};
const serverConfig = webpackMerge({}, commonPartial, serverPartial, {
  mode: 'development',
  entry: serverPartial.entry, // Temporary
  plugins: [
  ],
  externals: [nodeExternals({
    modulesFromFile: true
  })]
});

module.exports = serverConfig;
