const merge = require('webpack-merge');
const common = require('./webpack.common.js');
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const CompressionPlugin = require('compression-webpack-plugin');

/*
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: '[name].[hash].css',
  chunkFilename: '[id].[hash].css',
});*/
/*
const compressionPlugin = new CompressionPlugin({
  filename: '[file]',
  test: /\.(js|css|html|ico)(\?.*)?$/i,
});
*/

module.exports = (env = {}) =>
  merge(common, {
    mode: 'production',

    devtool: 'source-map',

    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'svg-react-loader',
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: ['file-loader'],
        },
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.jsx?$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
      ],
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },

    // optimization: {
    //   minimizer: [new UglifyJsPlugin()]
    // },

    /* plugins:
      env.compress !== 'false'
        ? [miniCssExtractPlugin, compressionPlugin]
        : [miniCssExtractPlugin], */
  });
