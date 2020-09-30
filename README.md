# Vue-Plugin-Npm 发布包

## 流程

### 1、开发插件
- 插件目录 (packages) 按需引入,每个组件均需提供install方法

``` javascript

// index.js

import Test from './src/test.vue';

// 为组件添加 install 方法，用于按需引入
Test.install = function (Vue) {
  Vue.component(Test.name, Test);
};

export default Test;

  ```
- 统一打包 (用于全局引入)

``` javascript

// packages / index.js

// 导入packages中各个组件
import Test from './test';
... // 其他组件

// 以数组的结构保存组件，便于遍历
const components = [
  Test,
  ... // 其他组件
];

// 定义 install 方法
const install = (Vue) => {
  if (install.installed) return;
  install.installed = true;
  // 遍历并注册全局组件
  components.map((component) => {
    Vue.component(component.name, component);
    return null;
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  // 导出的对象必须具备一个 install 方法
  install,
  // 组件列表
  ...components,
};

```

### 2、插件相关信息

``` javascript
// package.json
{
  "name": "bobo-npm-plugin",  // 插件名称
  "version": "0.1.2", // 版本号
  "description": "first npm test", // 描述
  "main": "lib/plugin.umd.min.js", // 入口文件地址
  "private": false, // 此处为true的话无法使用npm publish
  "license": "MIT", // 开源协议
  "keyword": "test", // 关键词
  "author": "BoBo<BoBoooooo159@gmail.com>", // 作者信息
  "scripts": { 
    "serve": "vue-cli-service serve", // 本地预览
    "lib": "vue-cli-service build --target lib --name plugin --dest lib packages/index.js" // 插件打包
  },
}

```

### 3、本地调试

npm run serve

/examples/App.vue

### 4、发布

- 注册npm账号

- npm run lib 

- npm login

- npm publish

### 5、项目中引入

npm install bobo-npm-plugin 

