module.exports = {
  presets: [['@vue/app', { useBuiltIns: 'entry', modules: false }]],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
  ],
};
