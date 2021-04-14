const path = require('path');
const fs = require('fs');

let externals = {};

externals = [
  Object.assign({
    ace: 'ace',
    'element-ui': 'ELEMENT', // 不打包element-ui
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
    },
  }),
];

exports.externals = externals;

exports.alias = {
  '@': path.resolve(__dirname, '../src'),
};
