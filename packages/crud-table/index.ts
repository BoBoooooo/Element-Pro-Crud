import CrudTable from './src/CrudTable.vue';

// 为组件添加 install 方法，用于按需引入
CrudTable.install = function (Vue) {
  Vue.component('CrudTable', CrudTable);
};

export default CrudTable;
