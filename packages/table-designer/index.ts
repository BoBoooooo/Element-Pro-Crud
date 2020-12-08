import TableDesignerDialog from './src/TableDesignerDialog.vue';

// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
TableDesignerDialog.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component(TableDesignerDialog.name, TableDesignerDialog);
};

export default TableDesignerDialog;
