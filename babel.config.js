module.exports = {
  presets: [['@vue/app', { useBuiltIns: 'entry' }]],


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
