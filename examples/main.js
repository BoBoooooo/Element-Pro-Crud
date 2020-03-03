import Vue from 'vue'
import App from './App.vue'
import BoBoNpmPluginTest from 'bobo-npm-plugin-test'
// import xxx from './packages/index';
Vue.use(BoBoNpmPluginTest)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
