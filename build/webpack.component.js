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
  stats: {
    assets: true,
    modules: false,
    entrypoints: false,
  },
  output: {
    path: path.resolve(process.cwd(), 'lib'),
    publicPath: '/dist/',
    filename: '[name].js',
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
  optimization: {
    minimize: true,
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
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // 关闭类型检查
              appendTsSuffixTo: ['\\.vue$'], // 编译 vue中lang="ts"。
              happyPackMode: false,
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        include: path.resolve('src/icons'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]',
            },
          },
          { loader: 'svgo-loader', options: {} },
        ],
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        exclude: path.resolve('src/icons'),
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
      filename: 'css/[name].css',
    }),
    new ProgressBarPlugin(),
    new webpack.BannerPlugin({
      entryOnly: true, // 是否仅在入口包中输出 banner 信息
      // eslint-disable-next-line no-useless-concat
      banner: () => `${name} v${version}` + '\n' + `Author: ${author}` + '\n' + `Documentation: ${homepage}` + '\n' + `Date: ${new Date()}`,
    }),
  ],
};
if (process.env.IS_REPORT) {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  );
}

module.exports = webpackConfig;
