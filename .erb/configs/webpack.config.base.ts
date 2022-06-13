/* eslint-disable no-useless-escape */
/**
 * Base webpack config used across other specific configs
 */
import webpack from 'webpack';
import StringReplacePlugin from 'string-replace-webpack-plugin';
import path from 'path';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
          },
        },
      },
      {
        enforce: 'pre',
        test: /unicode-properties[\/\\]unicode-properties/,
        use: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: "var fs = _interopDefault(require('fs'));",
              replacement() {
                return "var fs = require('fs');";
              },
            },
          ],
        }),
      },
      {
        test: /unicode-properties[\/\\]unicode-properties/,
        use: 'transform-loader?brfs',
      },
      { test: /pdfkit[/\\]js[/\\]/, use: 'transform-loader?brfs' },
      { test: /fontkit[\/\\]index.js$/, use: 'transform-loader?brfs' },
      {
        test: /linebreak[\/\\]src[\/\\]linebreaker.js/,
        use: 'transform-loader?brfs',
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    alias: {
      'unicode-properties': 'unicode-properties/unicode-properties.cjs.js',
      pdfkit: 'pdfkit/js/pdfkit.js',
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
