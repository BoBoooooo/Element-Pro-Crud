module.exports = {
  presets: ['@vue/app'],
  plugins: [
    '@babel/plugin-transform-modules-umd',
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
  ],
};
