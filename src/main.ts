import Vue from 'vue';
import App from '@/demo/App.vue';
// 导入ElementProCrud
// 引入ElementUI
import '@/demo/element';
import axios from '@/demo/api/axios';
import * as pluginsApis from '@/demo/api/plugin';
import { crud } from '@/demo/api/crud';
import plugin from './index';


Vue.use(plugin, {
  ...pluginsApis,
  crud,
});
Vue.config.productionTip = false;
// 开启dev编辑模式
Vue.prototype.$store = {
  getters: {
    config: {
      isDev: '1',
    },
  },
};
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
