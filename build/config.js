const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

let externals = {};

externals = [
  Object.assign({
    // vue: 'vue',
  }),
  // nodeExternals(),
];

exports.externals = externals;

exports.alias = {
  '@': path.resolve(__dirname, '../src'),
};

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue',
};
