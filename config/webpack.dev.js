const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const { merge } = require("webpack-merge");
const path = require('path')
const common = require("./webpack.common");

/** @type {import('webpack').Configuration} */
const devConfig = {
  mode: "development",
  devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    historyApiFallback: true,
    hot: true,
  },
  target: "web",
  module: {
    rules: [
      {
        use: ["style-loader", "css-loader", "sass-loader"],
        test: /\.(css|scss|sass)$/,
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: "wds",
        // webpack-dev-server: wds;
        // webpack-hot-middleware: whm;
        // webpack-plugin-serve: wps;
      },
    }),
  ],
  devtool: "eval-source-map",
  optimization: {
    runtimeChunk: 'single',
  },
};

module.exports = merge(common, devConfig);
