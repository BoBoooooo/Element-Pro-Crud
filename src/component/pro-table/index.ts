import ProTable from './src/ProTable.vue';
import '@/icons/svg/table_empty.svg'; // 自动导入src/icon目录下的svg图标

// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
ProTable.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component(ProTable.name, ProTable);
};

// 定义 install 方法
const install: any = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;
  // 遍历并注册全局组件
  Vue.prototype.$PROCRUD = options;
  Vue.component(ProTable.name, ProTable);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default ProTable;
