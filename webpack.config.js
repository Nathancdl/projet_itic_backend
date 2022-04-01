const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/**
 * Common webpack configuration that will be used in development and production
 */
module.exports = (env) => {
  let config = {
    target: 'node',
    entry: {
      index: ['babel-polyfill', './index.js']
    },/*
    node : {
      fs: 'empty',
      net: 'empty'
    },*/
    module: {
      rules: [
        {
          test: /\.js$/,
          
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
    resolve: {
      extensions: ['.js'],
    },
    plugins: [
      new CleanWebpackPlugin({cleanStaleWebpackAssets: true}),
      new NodePolyfillPlugin({
        excludeAliases: ["console"]
      }),
      //Copy other files in dist
      /*
      new CopyWebpackPlugin({
        patterns: [
          {from: 'manifest.json'},
        ],
      }),*/
    ],
    output: {filename: '[name].js', path: path.resolve(__dirname, 'dist'), publicPath: ''},
  };

  if (env.production) {
    config.mode = "production"
    config.optimization = {
      minimize: true,
      minimizer: [new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          }
        }
      })]
    }
  } else {
    config.mode = "development"
    config.devtool = 'inline-source-map'
  }
  return config;
}