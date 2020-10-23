/*
 * @file: 全局导出
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年03月03 11:20:05
 */

// packages / index.js

// 导入单个组件
import { FormDesigner, GenerateForm } from './form-designer';
import CrudTable from './crud-table';

// 以数组的结构保存组件，便于遍历
const components = [
  {
    name: 'FormDesigner',
    component: FormDesigner,
  },
  {
    name: 'CrudTable',
    // 此处深坑,vue-class-component export的组件没有name属性！！!
    component: CrudTable,
  },
  {
    name: 'GenerateForm',
    component: GenerateForm,
  },
];
// 定义 install 方法
const install: any = (Vue) => {
  if (install.installed) return;
  install.installed = true;
  // 遍历并注册全局组件
  components.map((com) => {
    Vue.component(com.name, com.component);
    return null;
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  // 导出的对象必须具备一个 install 方法
  install,
};

export {
  CrudTable,
  FormDesigner,
  GenerateForm,
};
