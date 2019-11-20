const { root } = require('./helpers');

/**
 * This is a server config which should be merged on top of common config
 */
module.exports = {
  entry: root('./src/index.ts'),
  output: {
    filename: 'main.js'
  },
  target: 'node',
  node: {
    __dirname: true
  }
};
