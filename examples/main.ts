import Vue from 'vue';
import App from './App.vue';
// import BoBoNpmPluginTest from 'bobo-npm-plugin-test'
import plugin from '../packages/index';

Vue.use(plugin);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
