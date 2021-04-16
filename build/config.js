const path = require('path');

externals = [
  Object.assign({
    ace: 'ace',
    'element-ui': {
      root: 'ELEMENT',
      commonjs: 'element-ui',
      commonjs2: 'element-ui',
      amd: 'element-ui',
    },
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
