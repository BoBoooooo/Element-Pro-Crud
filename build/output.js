const { terser } = require('rollup-plugin-terser');
const { author, license, name, version } = require('../package.json');
const getBanner = require('./utils/getBanner');
const { globals } = require('./common.var');

// / banner
const banner = {
  author: `2019-${new Date().getFullYear()} ${author}\n * Github https://github.com/BoBoooooo/Element-Pro-Crud`,
  license,
  name,
  version,
};

const OutputOptions = () => {
  const baseOutputOptions = {
    globals,
    entryFileNames: 'index.js',
    sourcemap: false,
    name: 'ProCrud',
    banner: getBanner(banner),
    sourcemapExcludeSources: false,
  };

  const miniOutputOptions = Object.assign({}, baseOutputOptions, {
    plugins: [terser()],
  });

  return [baseOutputOptions, miniOutputOptions];
};

module.exports = OutputOptions;
