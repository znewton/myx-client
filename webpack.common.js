const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const buildDir = path.join(__dirname, "build");

const cleanWebpackPlugin = new CleanWebpackPlugin([buildDir]);
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  title: "Myx",
  template: "./public/index.html",
  favicon: "./public/favicon.ico"
});

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].[hash].bundle.js",
    path: buildDir
  },

  resolve: {
    modules: [path.resolve(__dirname, "./src"), "node_modules"],
    extensions: [".jsx", ".js"]
  },

  plugins: [cleanWebpackPlugin, htmlWebpackPlugin]
};
