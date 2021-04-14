import FormDesigner from './src/FormDesigner.vue';
// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
FormDesigner.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component(FormDesigner.name, FormDesigner);
};

// 定义 install 方法
const install: any = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;
  // 遍历并注册全局组件
  // 全局挂载options
  Vue.prototype.$PROCRUD = options;
  Vue.component(FormDesigner.name, FormDesigner);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default FormDesigner;
