const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',

  devtool: 'source-map',

  devServer: {
    historyApiFallback: true,
    hot: true,
  },

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
});
