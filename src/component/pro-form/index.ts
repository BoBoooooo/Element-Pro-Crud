import Vue from 'vue';
import CrudTable from '@/component/crud-table/src/CrudTable.vue';
import ProFormItem from './src/ProFormItem.vue';
import ProLayout from './src/ProLayout.vue';
import ProForm from './src/ProForm.vue';

// 直接在入口处全局注册组件,避免递归嵌套引用报错
Vue.component('ProFormItem', ProFormItem);
Vue.component(ProLayout.name, ProLayout);
Vue.component(CrudTable.name, CrudTable);

// eslint-disable-next-line func-names
ProForm.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component('ProForm', ProForm);
};
// 定义 install 方法
const install: any = (Vue) => {
  if (install.installed) return;
  install.installed = true;
  Vue.component('ProForm', ProForm);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default ProForm;
