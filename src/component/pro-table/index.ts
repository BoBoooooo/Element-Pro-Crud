import ProTable from './src/ProTable.vue';

// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
ProTable.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component('ProTable', ProTable);
};

export default ProTable;
