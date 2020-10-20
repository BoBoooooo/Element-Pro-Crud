import Vue from 'vue';
import App from './App.vue';
// 直接引入lib进行npm install 模拟测试
// import plugin from '../lib/plugin.umd.js';
// import '../lib/plugin.css';
import plugin from '../packages/index';

Vue.use(plugin);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
