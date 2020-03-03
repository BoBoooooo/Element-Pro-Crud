/*
 * @file: packages/textarea/index.js
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年03月03 11:20:05
 */

// 导入组件，组件必须声明 name
import BoBoNpmPluginTest from './src/test.vue'

// 为组件添加 install 方法，用于按需引入
BoBoNpmPluginTest.install = function (Vue) {
    Vue.component(BoBoNpmPluginTest.name, BoBoNpmPluginTest)
}

export default BoBoNpmPluginTest