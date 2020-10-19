/*
 * @file: 声明vue拓展原型链上的属性类型
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年06月23 16:47:06
 */
/* eslint-disable */
import VueRouter, { Route } from 'vue-router';

import { Store } from 'vuex';

// 扩充
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $store: Store<any>;
    lodash: any;
    axios: any;
    dayjs: any;
    $pinyinmatch: any;
    install: any;
  }
  interface VueConstructor {
    install: any;
  }
}
