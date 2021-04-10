import ProForm from './src/ProForm.vue';

// eslint-disable-next-line func-names
ProForm.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  Vue.component('ProForm', ProForm);
};

export default ProForm;
