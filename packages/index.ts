/*
 * @file: 全局导出
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年03月03 11:20:05
 */

// packages / index.js

// 导入单个组件
import FormDesigner from './form-designer';
import CrudTable from './crud-table';

// 以数组的结构保存组件，便于遍历
const components = [
  // FormDesigner,
  CrudTable,
];
// 定义 install 方法
const install: any = (Vue) => {
  if (install.installed) return;
  install.installed = true;
  // 遍历并注册全局组件
  components.map((component) => {
    Vue.component('CrudTable', component);
    return null;
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  // 导出的对象必须具备一个 install 方法
  install,
  ...components,
};
