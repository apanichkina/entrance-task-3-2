const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: "development",
    devtool: "hidden-source-map",
    entry: {
      entry: './src/main.ts',
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    target: 'node',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
            },
          {
            test: /\.js$/,
            loader: 'babel-loader'
          },
          { test: /\.ts$/,
            loader: "ts-loader"
          }
        ]
    }
};