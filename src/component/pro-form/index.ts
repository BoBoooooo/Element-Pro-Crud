import ProForm from './src/ProForm.vue';

// eslint-disable-next-line func-names
ProForm.install = function (Vue, options) {
  if (options) {
    Vue.prototype.$PROCRUD = options;
  }
  console.log(ProForm.name);
  Vue.component(ProForm.name, ProForm);
};

export default ProForm;
