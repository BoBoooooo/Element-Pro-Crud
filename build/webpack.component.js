const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const Components = require('../components.json');
const config = require('./config');
const { name, version, author, homepage } = require('../package');

const webpackConfig = {
  mode: 'production',
  entry: Components,
  output: {
    path: path.resolve(process.cwd(), 'lib'),
    publicPath: '/dist/',
    filename: '[name].umd.min.js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd',
    library: 'ProCrud',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: config.alias,
    modules: ['node_modules'],
  },
  // 排除部分依赖不进行打包
  externals: config.externals,
  // 允许打包250kb以上的资源
  performance: {
    hints: false,
  },
  stats: 'none',
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false,
          },
        },
      },
      { test: /\.ts?$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(js?|babel|es6)$/,
        include: process.cwd(),
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(scss|css)$/,
        loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ProgressBarPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
    new webpack.BannerPlugin({
      entryOnly: true, // 是否仅在入口包中输出 banner 信息
      // eslint-disable-next-line no-useless-concat
      banner: () => `${name} v${version}` + '\n' + `Author: ${author}` + '\n' + `Documentation: ${homepage}` + '\n' + `Date: ${new Date()}`,
    }),
  ],
};

module.exports = webpackConfig;
