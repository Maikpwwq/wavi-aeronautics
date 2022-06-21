const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin"); 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
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
      directory: path.join(__dirname, "ssr/public"),
    },
    historyApiFallback: true,
    hot: true,
    client: false,
  },
  target: "web",
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,     
        plugins: require.resolve('react-refresh/babel')   
      },
      {
        use: [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // "style-loader",
        test: /\.(css|scss|sass)$/,
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: {
        // { entry?, module?, sockIntegration?, sockHost?, sockPath?, sockPort?, sockProtocol?, useURLPolyfill? }
        sockIntegration: "whm",
        // webpack-dev-server: wds;
        // webpack-hot-middleware: whm;
        // webpack-plugin-serve: wps;
      },
    }),
    new MiniCssExtractPlugin({filename:'assets/app.css'}),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      exclude: './node_modules/',
    })
  ],
  devtool: 'inline-source-map', // "eval-source-map",
  // optimization: {
  //   runtimeChunk: 'single',
  // },
};

module.exports = merge(common, devConfig);
