/*
 * @file: 声明vue拓展原型链上的属性类型
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年06月23 16:47:06
 */
// 扩充
declare module 'vue/types/vue' {
  interface Vue {
    $store: any;
    axios: any;
    dayjs: any;
    $pinyinmatch: any;
    install: any;
    HOST_URL: any;
    API_URL: any;
    $EventBus: any;
  }
  interface VueConstructor {
    install: any;
  }
}


declare global {
  interface Window {
    __HOST__URL__: string;
    __PREFIX__URL__: string;
  }
}

export {};
