const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const Components = require('../components.json');

let externals = {};

Object.keys(Components).forEach((key) => {
  externals[`element-pro-crud/src/component/${key}`] = `element-pro-crud/lib/${key}`;
});

externals = [
  Object.assign(
    {
      vue: 'vue',
    },
    externals,
  ),
  nodeExternals(),
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
