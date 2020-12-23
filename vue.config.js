/*
 * @file: vue.config.js
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年10月28 10:44:39
 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  productionSourceMap: false,
  // 将 examples 目录添加为新的页面
  pages: {
    index: {
      // page 的入口
      entry: 'examples/main.ts',
      // 模板来源
      template: 'examples/index.html',
      // 输出文件名
      filename: 'index.html',
    },
  },
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
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        packages: resolve('packages'),
      },
    },
  },
};
