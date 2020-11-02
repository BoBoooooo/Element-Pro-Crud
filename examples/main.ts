import Vue from 'vue'; 
import App from './App.vue';
// 导入ElementProCrud
import plugin from '../src/index';
// 引入ElementUI
import './element';
Vue.use(plugin);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
