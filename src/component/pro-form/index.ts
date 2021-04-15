import ProForm from './src/ProForm.vue';

// eslint-disable-next-line func-names
ProForm.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component('ProForm', ProForm);
};
// 定义 install 方法
const install: any = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;
  // 遍历并注册全局组件
  Vue.prototype.$PROCRUD = options;
  Vue.component('ProForm', ProForm);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default ProForm;
