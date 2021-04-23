/* eslint-disable camelcase */
/*
 * @file: roll up config
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2021-04-12 12:42:52
 */
import { babel } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import vuePlugin from 'rollup-plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';
import alias from '@rollup/plugin-alias';
import svg from 'rollup-plugin-svg';

const { terser } = require('rollup-plugin-terser');

const { join, resolve } = require('path');

const OutputOptions = require('./build/output');

module.exports = {
  input: join(__dirname, '/src/index.ts'),
  output: OutputOptions(),
  // eslint-disable-next-line no-useless-escape
  external: ['vue', 'element-ui'],
  plugins: [
    // 路径别名
    alias({
      entries: [{ find: '@', replacement: resolve(__dirname, './src') }],
    }),
    typescript(/* { plugin options } */),
    vuePlugin({
      css: true,
    }),
    svg(),
    postcss({
      minimize: true,
      extract: resolve('lib/ProCrud.css'),
    }),
    // externals({
    //   devDeps: false,
    // }),
    nodeResolve({
      extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
      preferBuiltins: true,
      jsnext: true,
      module: true,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    terser(),
    visualizer({
      open: true,
      brotliSize: true,
      gzipSize: true,
    }),
  ],
};
