/*
 * @file: 全局导出
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年03月03 11:20:05
 */

import '@/icons/autoImportSvg'; // 自动导入src/icon目录下的svg图标
// 导入单个组件
import { FormDesignerDialog, GenerateForm } from 'packages/form-designer';
import CrudTable from 'packages/crud-table';
import TableDesignerDialog from 'packages/table-designer';

// 以数组的结构保存组件，便于遍历
const components = [
  {
    name: 'FormDesignerDialog',
    component: FormDesignerDialog,
  },
  {
    name: 'CrudTable',
    // 此处深坑,vue-class-component export的组件没有name属性！！!
    component: CrudTable,
    isClassComponent: true,
  },
  {
    // 此处深坑,vue-class-component export的组件没有name属性！！!
    name: 'GenerateForm',
    component: GenerateForm,
    isClassComponent: true,
  },
  {
    name: 'TableDesignerDialog',
    component: TableDesignerDialog,
  },
];

// 定义 install 方法
const install: any = (Vue, options) => {
  if (install.installed) return;
  install.installed = true;
  // 遍历并注册全局组件
  components.map((com) => {
    // 全局挂载options
    if (options) {
      Vue.prototype.$PROCRUD = options;
    }
    Vue.component(com.name, com.component);
    return null;
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  FormDesignerDialog,
  CrudTable,
  GenerateForm,
  TableDesignerDialog,
};
