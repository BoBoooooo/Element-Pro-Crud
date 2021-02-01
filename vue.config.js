/*
 * @file: vue.config.js
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年10月28 10:44:39
 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const {
  name, version, author, homepage,
} = require('./package');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  chainWebpack: (config) => {
    if (process.env.IS_REPORT) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static',
        },
      ]);
    }
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'));
    // 添加svg-sprite-loader加载器
    config.module
      .rule('svg-sprite-loader')
      .test(/.svg$/)
      .include.add(resolve('src/icons')) // 处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .end();
  },
  configureWebpack: (config) => {
    const plugins = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            drop_debugger: false,
            drop_console: true,
          },
        },
        sourceMap: false,
        parallel: true,
      }),
      // 注意位置，必须放在 TerserPlugin 后面，否则生成的注释描述会被 TerserPlugin 或其它压缩插件清掉
      new webpack.BannerPlugin({
        entryOnly: true, // 是否仅在入口包中输出 banner 信息
        banner: () => `${name} v${version}`
                  + '\n'
                  + `Author: ${author}`
                  + '\n'
                  + `Documentation: ${homepage}`
                  + '\n'
                  + `Date: ${new Date()}`,
      }),
    ];
    if (process.env.NODE_ENV !== 'development') {
      config.plugins = [...config.plugins, ...plugins];
    }
  },
};
