// 导入组件，组件必须声明 name
import TableDesignerDialog from './src/TableDesignerDialog.vue';

// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
TableDesignerDialog.install = function (Vue) {
  Vue.component(TableDesignerDialog.name, TableDesignerDialog);
};

export default TableDesignerDialog;
