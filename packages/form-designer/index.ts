import FormDesignerDialog from './src/FormDesignerDialog.vue';

// 为组件添加 install 方法，用于按需引入
FormDesignerDialog.install = function (Vue) {
  Vue.component(FormDesignerDialog.name, FormDesignerDialog);
};

export default FormDesignerDialog;
