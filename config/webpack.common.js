const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack')

const ASSET_PATH = process.env.ASSET_PATH || ''; 
// prod  const ASSET_PATH = process.env.ASSET_PATH || '/wavi-aeronautics/'; // usar con script deploy gh-pages

/** @type {import('webpack').Configuration} */
module.exports = {
  name: "client",
  target: "web",
  entry: [
    "./src/index.js"
  ],
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[contenthash].js",
    publicPath: ASSET_PATH,
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
    modules: ['node_modules'],
    fallback: {
      fs: false,
      tls: false,
      net: false,
      dns: false,
      http2: false,
      worker_threads: false,
      child_process: false,
      request: false,
      fast_crc32c: false,
    }
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,        
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',        
          'css-loader',          
          'stylus-loader'
        ]
      },
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
    ],
  },  
  plugins: [
    new NodePolyfillPlugin(),
    // Esto nos permite utilizar de forma segura env vars en nuestro código
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
    new Dotenv(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      appMountId: 'root',
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      hash: true,
    }),
  ],
};
