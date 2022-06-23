const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require("path");
const Dotenv = require('dotenv-webpack')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});
const { REACT_APP_ENV, ASSET_PATH } = process.env;
const isDev = REACT_APP_ENV === 'development';
const entry = ['./src/index.js'];
if (isDev) {
  entry.push(
    // 'react-refresh/runtime',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true'
  );
}

/** @type {import('webpack').Configuration} */
module.exports = {
  name: "client",
  target: "web",
  entry,
  output: {
    path: path.resolve(__dirname, "ssr/public"),
    filename: isDev ? 'assets/app.js' : 'assets/app-[hash].js', // "[name].[contenthash].js",
    publicPath: ASSET_PATH || "",
    assetModuleFilename: 'assets/[name][ext]',
  },
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  resolve: {
    extensions: [".js", ".jsx", ".css"],
    modules: ['node_modules'],
    // fallback: {
    //   fs: false,
    //   tls: false,
    //   net: false,
    //   dns: false,
    //   http2: false,
    //   worker_threads: false,
    //   child_process: false,
    //   request: false,
    //   fast_crc32c: false,
    //   browser: false,
    // }
  },
  module: {
    rules: [
      // {
      //   // Loads the javacript into html template provided.
      //   // Entry point is set below in HtmlWebPackPlugin in Plugins
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: 'html-loader',
      //     },
      //   ],
      // },
      // {
      //   test: /\.styl$/,
      //   use: [
      //     'style-loader',        
      //     'css-loader',          
      //     'stylus-loader'
      //   ]
      // },
      {
        type: "asset/resource",
        test: /\.png$/i,
        // generator: {
        //   filename: {
        //     publicPath: 'wavi-aeronautics/[hash][ext]',
        //   },
        // },
      },
      {
        type: "asset",
        test: /\.(svg|jpg|jpeg|gif)$/i,
      },     
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      // {
      //   test: /\.json$/,
      //   loader: 'json-loader'
      // }
    ],
  },  
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true,
          priority: 1,
          filename: isDev
            ? 'assets/vendor.js'
            : 'assets/vendor-[contenthash].js',
          enforce: true,
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    new Dotenv(),
    new CleanWebpackPlugin(),
    // Ahora nuestro punto de montaje lo realizara en forma automatica Webpack en modo SSR
    // new HtmlWebpackPlugin({
    //   appMountId: 'root',
    //   template: path.resolve(__dirname, '../publicAssets/index.html'),
    //   filename: 'index.html',
    //   hash: true,
    // }),
  ],
};
