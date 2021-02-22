/*
 * @file: Router
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2021-02-22 12:28:10
 */

import Vue from 'vue';
import VueRouter from 'vue-router';


const originalPush = VueRouter.prototype.push;

// 处理路由跳转会报错的问题
VueRouter.prototype.push = function push(...rest) {
  return (originalPush as any).apply(this, rest);
};

Vue.use(VueRouter);


export default new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/demo/component/Dashboard.vue'),
      name: 'dashboard',
    },
    {
      path: '/form',
      component: () => import('@/demo/component/FormGenerate.vue'),
      name: 'FormGenerate',
    },
    {
      path: '/404',
      name: 'notFound',
      component: () => import('@/demo/component/Dashboard.vue'),
    },
    {
      path: '*',
      redirect: '/404',
      meta: {
        hidden: true,
      },
    },
  ],
});
