import FormDesignerDialog from './src/FormDesignerDialog.vue';
import GenerateForm from './src/GenerateForm.vue';
// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
FormDesignerDialog.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component(FormDesignerDialog.name, FormDesignerDialog);
};

// eslint-disable-next-line func-names
GenerateForm.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component(GenerateForm.name, GenerateForm);
};

export {
  FormDesignerDialog,
  GenerateForm,
};
