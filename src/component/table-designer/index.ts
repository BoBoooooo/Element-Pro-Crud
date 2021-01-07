import TableDesigner from './src/TableDesigner.vue';

// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
TableDesigner.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component(TableDesigner.name, TableDesigner);
};

export default TableDesigner;
