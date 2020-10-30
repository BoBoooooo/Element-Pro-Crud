/*
 * @file: packages/textarea/index.js
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年03月03 11:20:05
 */

// 导入组件，组件必须声明 name
import FormDesignerDialog from './src/FormDesignerDialog.vue';

// 为组件添加 install 方法，用于按需引入
// eslint-disable-next-line func-names
FormDesignerDialog.install = function (Vue) {
  Vue.component(FormDesignerDialog.name, FormDesignerDialog);
};

export default FormDesignerDialog;
