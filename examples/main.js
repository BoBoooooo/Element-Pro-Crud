import Vue from 'vue';
import App from './App.vue';
// import BoBoNpmPluginTest from 'bobo-npm-plugin-test'
import FormDesigner from '../packages/index';

Vue.use(FormDesigner);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
