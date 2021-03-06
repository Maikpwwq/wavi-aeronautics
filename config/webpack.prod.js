const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require("webpack-merge");
const path = require('path')
const common = require("./webpack.common");

/** @type {import('webpack').Configuration} */
const prodConfig = {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,        
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", 
          "sass-loader"
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    // [hash] is now [fullhash] - [chunkhash] or [contenthash]
    new MiniCssExtractPlugin({filename:'assets/app.[chunkhash].css'}), 
    new CompressionWebpackPlugin({
      test: /\.js$|\.css$/,
      filename: '[path][base].gz',
    }),
    new WebpackManifestPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: path.resolve(__dirname, '../ssr/public'),
    }),
  ],
};

module.exports = merge(common, prodConfig);
