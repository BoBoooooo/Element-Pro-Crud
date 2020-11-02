import TableDesignerDialog from './src/TableDesignerDialog.vue';

// 为组件添加 install 方法，用于按需引入
TableDesignerDialog.install = function (Vue) {
  Vue.component(TableDesignerDialog.name, TableDesignerDialog);
};

export default TableDesignerDialog;
