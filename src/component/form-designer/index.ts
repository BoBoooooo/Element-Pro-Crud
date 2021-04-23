import Vue from 'vue';
// import '@/icons/autoImportSvg'; // 自动导入src/icon目录下的svg图标
import ProFormItem from '@/component/pro-form/src/ProFormItem.vue';
import ProLayout from '@/component/pro-form/src/ProLayout.vue';
import WidgetFormItem from './src/WidgetFormItem.vue';
import WidgetLayout from './src/WidgetLayout.vue';
import FormDesigner from './src/FormDesigner.vue';

// 直接在入口处全局注册组件,避免递归嵌套引用报错
Vue.component(WidgetFormItem.name, WidgetFormItem);
Vue.component(WidgetLayout.name, WidgetLayout);
Vue.component('ProFormItem', ProFormItem);
Vue.component(ProLayout.name, ProLayout);

// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
FormDesigner.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component(FormDesigner.name, FormDesigner);
};

// 定义 install 方法
const install: any = (Vue) => {
  if (install.installed) return;
  install.installed = true;
  Vue.component(FormDesigner.name, FormDesigner);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default FormDesigner;
