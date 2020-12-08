import Vue from 'vue';
import App from './App.vue';
// 导入ElementProCrud
import plugin from '../src/index';
// 引入ElementUI
import './element';
import axios from './api/axios';
import * as pluginsApis from './api/plugin';
import { crud } from './api/crud';


Vue.use(plugin, {
  ...pluginsApis,
  crud,
});
Vue.config.productionTip = false;

axios({
  url: '/users/login',
  method: 'post',
  data: {
    password: '123',
    username: 'admin',
  },
}).then((res) => {
  sessionStorage.setItem('token', res.data.token);
  new Vue({
    render: h => h(App),
  }).$mount('#app');
});
