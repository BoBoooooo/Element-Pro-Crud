## [0.9.4-1](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.9.2...0.9.4-1) (2021-04-16)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 支持事件注入(规则 field:eventName) | [be10ddd](https://github.com/BoBoooooo/Element-Pro-Crud/commit/be10ddd)
 CrudTable | 新增动态插槽,直接跟表单设计器自定义插槽联动 [@0](https://github.com/0).9.2-14 | [e9a10e8](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e9a10e8)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 调整目录结构,GenerateForm改名为ProForm | [76fea47](https://github.com/BoBoooooo/Element-Pro-Crud/commit/76fea47)
 - | btn-bar css perf | [82fc351](https://github.com/BoBoooooo/Element-Pro-Crud/commit/82fc351)
 - | change /deep/ to ::v-deep | [c90dcf7](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c90dcf7)
 - | change code style | [4cc4af1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/4cc4af1)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复表格布局下组件初始化bug [@0](https://github.com/0).9.2-6 | [5ee737f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/5ee737f)
 - | 修复级联选择器自定义value,label别称bug [@0](https://github.com/0).9.2-10 | [b9f738d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b9f738d)
 - | 修复嵌套布局时点击事件bug [@0](https://github.com/0).9.3-4 | [c6e9fca](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c6e9fca)
 - | 修复子表单初始化默认值不回填bug [@0](https://github.com/0).9.2-7 | [b89df0b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b89df0b)
 - | 修复子表单删除数据清空时数据刷新bug [@0](https://github.com/0).9.2-7 | [72d238e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/72d238e)
 - | CrudTable支持传入columns [@0](https://github.com/0).9.2-4 | [347ea93](https://github.com/BoBoooooo/Element-Pro-Crud/commit/347ea93)


### 📝 文档
范围|描述|commitId
--|--|--
 - | update doc | [8f1f750](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8f1f750)
 - | update doc | [9430035](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9430035)
 - | update doc | [26f3ee7](https://github.com/BoBoooooo/Element-Pro-Crud/commit/26f3ee7)


### 📦 持续集成
范围|描述|commitId
--|--|--
 - | add prettier code formatter | [883f256](https://github.com/BoBoooooo/Element-Pro-Crud/commit/883f256)
 - | remove dep | [f730cbf](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f730cbf)


### 🔙 撤销
范围|描述|commitId
--|--|--
 - | 暂时移除按需引入方式 | [282c502](https://github.com/BoBoooooo/Element-Pro-Crud/commit/282c502)


### 🔨 代码重构
范围|描述|commitId
--|--|--
 - | 布局组件支持无限嵌套,重构部分代码 | [aec4028](https://github.com/BoBoooooo/Element-Pro-Crud/commit/aec4028)
 - | 移除表单属性中布局方式属性,新增表单字段控制相关全局api | [ecc5435](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ecc5435)
 - | 重构二次暂存 | [70129a2](https://github.com/BoBoooooo/Element-Pro-Crud/commit/70129a2)
 - | 重构暂存一次 | [4f90bb3](https://github.com/BoBoooooo/Element-Pro-Crud/commit/4f90bb3)
 - | GenerateFormDialog按composition api 语法重构,修复已知bug | [03642d8](https://github.com/BoBoooooo/Element-Pro-Crud/commit/03642d8)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 调整demo目录结构,新增表单示例formDemo | [ac46da5](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ac46da5)
 - | form-designer css change [@0](https://github.com/0).9.2-13 | [6cf9cac](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6cf9cac)
 @0.9.2-10 | 移除popover属性,优化查询区域布局,composition-api重构searchForm | [8bc815e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8bc815e)
 - | 表格布局支持级联动态隐藏 [@0](https://github.com/0).9.2-9 | [f947fb6](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f947fb6)
 - | 移除treeselect引用,减小umd包大小,更新至0.9.2-5 | [2e160e1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2e160e1)
 - | 优化表格设计器样式,移除lodash [@0](https://github.com/0).9.2-1 | [ba74705](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ba74705)
 - | 优化平铺查询模式下自定义按钮显示位置 | [805bbff](https://github.com/BoBoooooo/Element-Pro-Crud/commit/805bbff)
 - | 优化CrudTable插槽传入方式,修复 [@0](https://github.com/0).9.2-2 | [7853c58](https://github.com/BoBoooooo/Element-Pro-Crud/commit/7853c58)
 - | 只读模式下操作列默认隐藏 | [082a0a8](https://github.com/BoBoooooo/Element-Pro-Crud/commit/082a0a8)


### chore
范围|描述|commitId
--|--|--
 - | update CHANGELOG | [892d946](https://github.com/BoBoooooo/Element-Pro-Crud/commit/892d946)
 - | update crud version to 0.9.4 | [4a3e3be](https://github.com/BoBoooooo/Element-Pro-Crud/commit/4a3e3be)
 - | update version to 0.9.2-1 | [a3064ef](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a3064ef)
 - | update version to 0.9.2-15,refactor layout component | [6f25688](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6f25688)
 - | update version to 0.9.3 | [14b8e82](https://github.com/BoBoooooo/Element-Pro-Crud/commit/14b8e82)
 - | update version to 0.9.3-1 | [1083fd6](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1083fd6)
 - | update version to 0.9.3-2 | [042ab51](https://github.com/BoBoooooo/Element-Pro-Crud/commit/042ab51)
 - | update version to 0.9.3-3 | [9cde249](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9cde249)

## [0.9.2](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.9.1...0.9.2) (2021-03-20)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 新增默认隐藏配置项,新增validate校验表单api | [18a6728](https://github.com/BoBoooooo/Element-Pro-Crud/commit/18a6728)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复删除提示bug [@0](https://github.com/0).9.1-6 | [05635ef](https://github.com/BoBoooooo/Element-Pro-Crud/commit/05635ef)
 - | 修复自定义错误提示语未及时更新bug/修复组件单独设置labelWidth失效bug/修复 [@0](https://github.com/0).9.1-11 | [3b71cb1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3b71cb1)
 - | 修复子表单编辑后无法还原之前表单数据bug [@0](https://github.com/0).9.1-7 | [d1c38a7](https://github.com/BoBoooooo/Element-Pro-Crud/commit/d1c38a7)
 - | 修复子表单获取主表单数据失败Bug [@0](https://github.com/0).9.1-4 | [5f45081](https://github.com/BoBoooooo/Element-Pro-Crud/commit/5f45081)
 - | 修复子表单宽度自适应bug | [27e2e36](https://github.com/BoBoooooo/Element-Pro-Crud/commit/27e2e36)
 - | 修复子表单行数据取消后无法还原原始数据bug [@0](https://github.com/0).9.1-8 | [3fc26a5](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3fc26a5)
 - | 修复子表单bug [@0](https://github.com/0).9.1-3 | [f810d9c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f810d9c)
 @0.9.1-1 | 修复device-btn样式丢失bug | [9c2915e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9c2915e)


### 🔨 代码重构
范围|描述|commitId
--|--|--
 Column | 重构ProTable,支持多级表头,优化高级查询表单样式 [@0](https://github.com/0).9.2 | [9c306a6](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9c306a6)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 优化表格布局添加行列逻辑 | [88210a9](https://github.com/BoBoooooo/Element-Pro-Crud/commit/88210a9)
 - | 优化表格布局样式,几处细节修复 | [e32ebf1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e32ebf1)
 - | 优化子表单数据为空的情况下显示效果 [@0](https://github.com/0).9.1-10 | [3a6aa60](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3a6aa60)
 @0.9.1-5 | 布局组件支持嵌套子表单组件 | [b36c533](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b36c533)
 - | 更新文档地址 | [3f9892b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3f9892b)

## [0.9.1](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.9.0...0.9.1) (2021-03-12)

### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复表单设计器上方按钮css丢失bug | [845defa](https://github.com/BoBoooooo/Element-Pro-Crud/commit/845defa)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 版本升级至0.9.1 | [8a43b8e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8a43b8e)
 - | 移除MessageBox,Message引入,减小40k左右的打包大小 | [f4794cd](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f4794cd)
 - | 自定义插槽优化设计显示 | [7bdebdf](https://github.com/BoBoooooo/Element-Pro-Crud/commit/7bdebdf)
 - | tinymce改为cdn引入 | [3ed8e4e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3ed8e4e)

# [0.9.0](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.8.9...0.9.0) (2021-03-10)

### 🌟 新功能
范围|描述|commitId
--|--|--
 @0.9.0 | 布局组件新增禁止嵌套提醒,子表单仅支持拖拽表单组件提醒 | [ee72394](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ee72394)

## [0.8.9](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.8.8...0.8.9) (2021-03-09)

### 🌟 新功能
范围|描述|commitId
--|--|--
 @0.8.9 | 优化GenerateFormItem内部绑定逻辑 | [0d615ab](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0d615ab)
 - | 表单设计器新增背景 | [57fe30d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/57fe30d)
 - | 表格布局时新增单元格点击事件,支持默认选中input,select,textarea | [1a741bb](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1a741bb)
 - | 新增pc,mobile,pad3种设备切换预览表单 | [51f0472](https://github.com/BoBoooooo/Element-Pro-Crud/commit/51f0472)
 - | 左侧附件支持鼠标点击形式添加至画布区域 | [df1906d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/df1906d)
 @0.8.8-7 | 新增表格布局,合并后删除行列逻辑待优化 | [6c2c3c6](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6c2c3c6)
 - | update version to 0.8.8-2 | [123e5b9](https://github.com/BoBoooooo/Element-Pro-Crud/commit/123e5b9)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 溢出隐藏 | [94e1d1e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/94e1d1e)
 - | 优化表格布局报错提示信息位置 | [39919a7](https://github.com/BoBoooooo/Element-Pro-Crud/commit/39919a7)
 - | code prettier | [9572a3a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9572a3a)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 @0.8.8-17 | 修复时间选择器初始值bug | [e9b0b1b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e9b0b1b)
 - | 修复边框判断bug | [69482e8](https://github.com/BoBoooooo/Element-Pro-Crud/commit/69482e8)
 - | 修复插槽隐藏标签无效bug [@0](https://github.com/0).8.8-10 | [325a686](https://github.com/BoBoooooo/Element-Pro-Crud/commit/325a686)
 - | 修复联动后未清空表单校验结果 | [873ea47](https://github.com/BoBoooooo/Element-Pro-Crud/commit/873ea47)
 - | 修复组件联动多选情况下bug [@0](https://github.com/0).8.8-13 | [b335cca](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b335cca)
 - | 修复组件联动默认值bug 0.8.8-14 | [e883e60](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e883e60)
 - | 修复组件联动取消联动bug [@0](https://github.com/0).8.8-1 | [e8f35ac](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e8f35ac)
 - | fix code bug | [ce9a47a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ce9a47a)


### 📝 文档
范围|描述|commitId
--|--|--
 - | update doc url | [19ff76a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/19ff76a)


### 🔨 代码重构
范围|描述|commitId
--|--|--
 - | 重构删除所在行所在列方法,优化样式,删除所在行在复杂合并情况下依旧有bug,暂存提交一次 | [d1f3731](https://github.com/BoBoooooo/Element-Pro-Crud/commit/d1f3731)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 表单设计器默认选中表单属性 | [aeb4fb5](https://github.com/BoBoooooo/Element-Pro-Crud/commit/aeb4fb5)
 - | 表格布局时优化组件联动隐藏边框线1px问题 [@0](https://github.com/0).8.8-5 | [59937b4](https://github.com/BoBoooooo/Element-Pro-Crud/commit/59937b4)
 - | 调整表格设计器代码 | [79fe40f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/79fe40f)
 - | 删除当前行优化判断,包含合并行情况不允许删除 | [3872efe](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3872efe)
 - | 优化组件联动hidden属性赋值方式 [@0](https://github.com/0).8.8-3 | [bdc9d4c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/bdc9d4c)
 - | some change | [026e19f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/026e19f)
 @0.8.8-15 | 优化表格布局向下合并逻辑,修复ace初始化bug | [e6e57f2](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e6e57f2)
 - | 组件联动支持多选情况 | [17fa57b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/17fa57b)
 @0.8.8-4 | 优化组件联动规则,联动前先重置原先已联动组件 | [26b5599](https://github.com/BoBoooooo/Element-Pro-Crud/commit/26b5599)


### chore
范围|描述|commitId
--|--|--
 - | update version to 0.8.8-11 | [579ef0f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/579ef0f)

## [0.8.8](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.8.7...0.8.8) (2021-02-22)

### 🌟 新功能
范围|描述|commitId
--|--|--
 GenerateForm | 新增Prop rules 支持组件联动 | [45011e3](https://github.com/BoBoooooo/Element-Pro-Crud/commit/45011e3)
 - | 表单设计器单独页面,新增vue-router | [421e35b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/421e35b)
 - | 表单设计器新增布局模式/预览模式切换 | [bf473ff](https://github.com/BoBoooooo/Element-Pro-Crud/commit/bf473ff)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 表单设计器UI优化 | [1a72c7f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1a72c7f)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复头像上传区域宽度bug | [3642218](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3642218)
 - | 修复网络卡顿时固定列错位问题 [@0](https://github.com/0).8.7-4 | [82db330](https://github.com/BoBoooooo/Element-Pro-Crud/commit/82db330)


### 📝 文档
范围|描述|commitId
--|--|--
 - | fix error | [18f2171](https://github.com/BoBoooooo/Element-Pro-Crud/commit/18f2171)
 - | update doc | [8baa019](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8baa019)


### 🔨 代码重构
范围|描述|commitId
--|--|--
 - | 修改rules判断规则 | [7c71c3d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/7c71c3d)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 插件更新至0.8.7-1,修复富文本宽度不撑满容器问题 | [aafc965](https://github.com/BoBoooooo/Element-Pro-Crud/commit/aafc965)
 - | 富文本宽度改为100% | [2f6210e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2f6210e)
 - | 优化树形下拉框预览效果 | [b30ac1d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b30ac1d)
 - | remove abandoned option | [86045b9](https://github.com/BoBoooooo/Element-Pro-Crud/commit/86045b9)
 - | some change 优化表单设计器 | [4c6ff60](https://github.com/BoBoooooo/Element-Pro-Crud/commit/4c6ff60)
 - | update dashboard | [6d50243](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6d50243)
 0.8.7-5 | 表单设计器数据来源"字典"通过prop单独引入 | [3ec7495](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3ec7495)
 - | update version to 0.8.7-3 | [06b33e1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/06b33e1)
 cascader | 优化级联选择器交互 | [f9e8638](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f9e8638)

## [0.8.7](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.8.6...0.8.7) (2021-02-04)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 更新demo示例 | [3ade49d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3ade49d)
 - | 新增头像上传组件 | [968baa0](https://github.com/BoBoooooo/Element-Pro-Crud/commit/968baa0)
 - | 新增头像上传组件 | [3091d9f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3091d9f)
 - | 新增Tab布局组件 | [c96b4c3](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c96b4c3)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 更换表单设计器左侧button标签为div | [f11fe72](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f11fe72)
 - | 滚动导航新增鼠标pointer效果 | [a491838](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a491838)
 - | add hover style | [2369365](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2369365)
 - | some change | [c54b542](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c54b542)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复promiseForSelect prop缺失bug | [62b8f4b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/62b8f4b)


### 📝 文档
范围|描述|commitId
--|--|--
 - | update docs | [0777361](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0777361)
 - | update README | [411bf36](https://github.com/BoBoooooo/Element-Pro-Crud/commit/411bf36)


### 📦 持续集成
范围|描述|commitId
--|--|--
 - | 新增BannerPlugin | [ea7562c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ea7562c)
 - | update banner info | [c7d1c48](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c7d1c48)


### 🔨 代码重构
范围|描述|commitId
--|--|--
 - | 重构部分代码 | [d952565](https://github.com/BoBoooooo/Element-Pro-Crud/commit/d952565)
 - | 重构拖拽部分代码 | [1e8c8e1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1e8c8e1)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 表格初始化高度优化 | [ce8e54c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ce8e54c)
 - | 默认使用普通布局 | [101327f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/101327f)
 - | 新增添加栅格添加标签页快捷按钮 [@0](https://github.com/0).8.6-2 | [09c5fac](https://github.com/BoBoooooo/Element-Pro-Crud/commit/09c5fac)
 - | 优化头像组件 [@0](https://github.com/0).8.6-6 | [59c963a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/59c963a)
 - | 优化头像组件属性 | [5941a6d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/5941a6d)
 ProTable | tableTitle默认显示 | [8fed41e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8fed41e)


### chore
范围|描述|commitId
--|--|--
 - | 插件升级至[@0](https://github.com/0).8.7 | [a4f9435](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a4f9435)

## [0.8.6](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.8.5...0.8.6) (2021-01-29)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 新增通用图表组件 | [afd13cd](https://github.com/BoBoooooo/Element-Pro-Crud/commit/afd13cd)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 新增ChartScreen作为图表Demo | [589e1e8](https://github.com/BoBoooooo/Element-Pro-Crud/commit/589e1e8)
 - | 优化demo代码格式,新增滚动导航条 | [9f612e1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9f612e1)


### chore
范围|描述|commitId
--|--|--
 - | update version to 0.8.6 | [c98ebda](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c98ebda)

## [0.8.5](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.8.4...0.8.5) (2021-01-28)

### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 移除多余代码 | [bf2a4a2](https://github.com/BoBoooooo/Element-Pro-Crud/commit/bf2a4a2)
 - | change prettierrc rule | [b849d8b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b849d8b)


### 📝 文档
范围|描述|commitId
--|--|--
 - | update README | [ec1775c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ec1775c)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 图表,HTML组件引入ace支持在线修改json,优化组件代码 | [25e1399](https://github.com/BoBoooooo/Element-Pro-Crud/commit/25e1399)
 - | 修改event事件名称 | [61dd7cd](https://github.com/BoBoooooo/Element-Pro-Crud/commit/61dd7cd)


### chore
范围|描述|commitId
--|--|--
 - | version update to 0.8.5 | [624406a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/624406a)

## [0.8.4](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.8.3...0.8.4) (2021-01-26)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 表单设计器新增饼图/柱状图/折线图组件(cdn) [@0](https://github.com/0).8.4 | [de17722](https://github.com/BoBoooooo/Element-Pro-Crud/commit/de17722)
 - | 补充ProTable rowKey属性 | [9f91d3a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9f91d3a)
 - | 解耦版本暂存 | [0513976](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0513976)
 CrudTable | textMap新增批量删除按钮 | [42424cd](https://github.com/BoBoooooo/Element-Pro-Crud/commit/42424cd)
 Input,Form | 单行文本组件新增前缀后缀配置项,表单设置新增表单名,表单使用位置,表单尺寸配置项 | [18b8bc1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/18b8bc1)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 优化demo布局 | [fe92c6b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/fe92c6b)
 - | remove useless import | [923135b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/923135b)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复部分细节 | [b28fd81](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b28fd81)
 - | 修复已知Bug | [fcd7835](https://github.com/BoBoooooo/Element-Pro-Crud/commit/fcd7835)
 - | 修复function命名拼写错误 | [ba80f58](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ba80f58)
 - | 修复ProTable tableParmas bug [@0](https://github.com/0).8.3-4 | [1264c32](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1264c32)
 - | 修复request方法返回值Bug | [af9574e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/af9574e)
 - | fix table height bug | [678ffe5](https://github.com/BoBoooooo/Element-Pro-Crud/commit/678ffe5)


### 📝 文档
范围|描述|commitId
--|--|--
 - | 修改在线demo地址 | [67e931f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/67e931f)


### 🔨 代码重构
范围|描述|commitId
--|--|--
 - | 新增request columns属性ts类型说明 | [6e27b73](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6e27b73)
 - | 引入[@vue](https://github.com/vue)/composition-api 重构ProTable组件代码 | [1011aa2](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1011aa2)
 - | CrudTable组件改用composition api 重构 | [053856b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/053856b)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 部分代码重构 | [586744f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/586744f)
 - | 更新demo | [fa762e6](https://github.com/BoBoooooo/Element-Pro-Crud/commit/fa762e6)
 - | 新增图表组件,暂存提交待开发 | [0417a39](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0417a39)
 - | 修改demo内容 | [27cb81d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/27cb81d)
 - | 修改demo示例地址 | [cb77221](https://github.com/BoBoooooo/Element-Pro-Crud/commit/cb77221)
 - | 移除ProTable多余属性 | [df2772b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/df2772b)
 - | 优化表单设计器操作按钮颜色 | [38b9eca](https://github.com/BoBoooooo/Element-Pro-Crud/commit/38b9eca)
 - | 优化button组件,input 新增append button支持 | [57f9bb6](https://github.com/BoBoooooo/Element-Pro-Crud/commit/57f9bb6)
 - | 优化crudtable demo | [f8646d4](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f8646d4)
 - | 暂存一次提交 | [1d52132](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1d52132)
 - | 重构版本提交 [@0](https://github.com/0).8.3-2 | [d3171be](https://github.com/BoBoooooo/Element-Pro-Crud/commit/d3171be)
 - | crud-table组件优化 | [cab469f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/cab469f)
 - | CrudTable注册为插件 | [dc8c92b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/dc8c92b)


### chore
范围|描述|commitId
--|--|--
 - | version update to 0.8.3-1 | [7bb90d0](https://github.com/BoBoooooo/Element-Pro-Crud/commit/7bb90d0)

## [0.8.3](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.8.0...0.8.3) (2021-01-12)

### 🌟 新功能
范围|描述|commitId
--|--|--
 CrudTable | 查询区域支持平铺弹出两种模式 | [0a571ce](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0a571ce)
 CrudTable | 新增columns属性 | [9b60405](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9b60405)
 - | 新增导入json,生成代码,生成json,引入ace-editor | [f3a7eeb](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f3a7eeb)
 - | 引入tinymce富文本js | [97a95e4](https://github.com/BoBoooooo/Element-Pro-Crud/commit/97a95e4)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 高级查询表单样式优化 移除冗余代码 | [e65dd3d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e65dd3d)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复表格设计器高级查询字典配置bug,版本升级至0.8.3 | [6df89f3](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6df89f3)
 - | 修复表格设计器字典bug [@0](https://github.com/0).8.1 | [1531681](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1531681)
 - | 修复高级查询按钮prop拼写bug | [361fc91](https://github.com/BoBoooooo/Element-Pro-Crud/commit/361fc91)
 - | url修改为线上地址 | [72b096c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/72b096c)


### 📝 文档
范围|描述|commitId
--|--|--
 - | update readme | [04e0b58](https://github.com/BoBoooooo/Element-Pro-Crud/commit/04e0b58)


### 🔨 代码重构
范围|描述|commitId
--|--|--
 - | 表单设计器上方子表单改为el-form | [b4bcb5e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b4bcb5e)
 - | 调整目录结构,重构部分代码 | [c40313f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c40313f)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 版本升级至0.8.2 | [c2f0a9a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c2f0a9a)
 - | 表格设计器优化 | [e69f99f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e69f99f)
 - | 表格设计器自动设置菜单顺序调整 | [c40677d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c40677d)
 - | 代码优化移除多余代码 | [3513446](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3513446)
 - | 解耦部分代码,版本升级至0.8.0-3 | [4c8c127](https://github.com/BoBoooooo/Element-Pro-Crud/commit/4c8c127)
 - | 完善demo示例 | [b7f039f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/b7f039f)
 - | 细节优化,修改演示demo | [f277a96](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f277a96)
 - | 新增readOnly属性控制表格表单全局只读 | [df1f1db](https://github.com/BoBoooooo/Element-Pro-Crud/commit/df1f1db)
 - | 优化表格设计器 | [f00f025](https://github.com/BoBoooooo/Element-Pro-Crud/commit/f00f025)
 - | 优化操作列隐藏宽度 | [0e00cec](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0e00cec)
 - | 优化高级查询表单代码 | [a5b4ca7](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a5b4ca7)
 0.8.0-1 | update README | [03ddf40](https://github.com/BoBoooooo/Element-Pro-Crud/commit/03ddf40)
 CrudTable | CurdTable组件优化,修改操作列判断逻辑,修改自定义column插槽默认命名 | [5508992](https://github.com/BoBoooooo/Element-Pro-Crud/commit/5508992)


### chore
范围|描述|commitId
--|--|--
 - | 版本升级至0.8.0-6 | [a720b19](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a720b19)


范围|描述|commitId
--|--|--
 - | Create LICENSE | [8e76716](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8e76716)

# [0.8.0](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.7.2...0.8.0) (2021-01-05)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 新增子表单组件,支持行内编辑.调整代码格式等 | [6f3ad48](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6f3ad48)
 - | 子表单组件支持预设值预设查询参数 | [e9d40a4](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e9d40a4)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 添加按钮新增hover样式 | [2ec4da0](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2ec4da0)
 - | 移除冗余代码 | [026da83](https://github.com/BoBoooooo/Element-Pro-Crud/commit/026da83)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复单选框组bug | [a77316d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a77316d)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 优化栅格布局添加列操作,支持复制.新增子表单功能待开发 | [e2996e1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e2996e1)
 - | 优化子表单组件细节 | [9e08b16](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9e08b16)
 - | 优化widgetConfig | [019b046](https://github.com/BoBoooooo/Element-Pro-Crud/commit/019b046)
 - | 子表单组件支持必填判断 | [576696c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/576696c)
 - | 组件细节优化 | [019baf1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/019baf1)
 - | ElementProCrud版本升级至0.8.0 | [be98846](https://github.com/BoBoooooo/Element-Pro-Crud/commit/be98846)

## [0.7.2](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.7.1...0.7.2) (2020-12-31)

### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 版本更新至0.7.2 | [fdfbcf0](https://github.com/BoBoooooo/Element-Pro-Crud/commit/fdfbcf0)
 - | 修复classname bug | [6a1f6f7](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6a1f6f7)

## [0.7.1](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.7.0...0.7.1) (2020-12-31)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 版本号升级至0.7.1 | [ff2acec](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ff2acec)
 - | 新增分割线组件 | [6ff573a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6ff573a)
 - | 新增清空按钮 | [28dd21b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/28dd21b)
 - | 新增隐藏标签配置项 | [02e20df](https://github.com/BoBoooooo/Element-Pro-Crud/commit/02e20df)
 - | 新增HTML组件 | [7c63078](https://github.com/BoBoooooo/Element-Pro-Crud/commit/7c63078)
 - | 新增terser-webpack-plugin插件build时移除console等多余代码 | [15582c5](https://github.com/BoBoooooo/Element-Pro-Crud/commit/15582c5)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 优化表单设计器样式 | [e28d7e8](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e28d7e8)
 - | 优化设计器高度 | [19d7081](https://github.com/BoBoooooo/Element-Pro-Crud/commit/19d7081)
 - | modify copyright | [207cc6a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/207cc6a)

# [0.7.0](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.6.3...0.7.0) (2020-12-20)

### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 @0.7.0 | 修复表单设计器保存after-save event bug | [2719e64](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2719e64)
 - | 修复GenerateForm初始化bug [@0](https://github.com/0).6.4 | [9595e6f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9595e6f)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 表单设计器dialog,表格设计器新增 append to body | [bc89e44](https://github.com/BoBoooooo/Element-Pro-Crud/commit/bc89e44)

## [0.6.3](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.6.2...0.6.3) (2020-12-20)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 新增dev开发者模式 | [77ac94b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/77ac94b)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 修改高级查询表单样式 | [6cae64e](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6cae64e)


### chore
范围|描述|commitId
--|--|--
 - | 版本升级至0.6.3 (新增dev模式,优化高级查询工具栏) | [98de7c3](https://github.com/BoBoooooo/Element-Pro-Crud/commit/98de7c3)

## [0.6.2](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.6.0...0.6.2) (2020-12-20)

### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复字典value bug | [a1f4d31](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a1f4d31)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 @0.6.2 | 修改dialogWidth,dialogAppendToBody默认值 | [be6457d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/be6457d)
 - | 修改字典下拉框prop [@0](https://github.com/0).6.1 | [5e91320](https://github.com/BoBoooooo/Element-Pro-Crud/commit/5e91320)
 - | 移除多余属性优化代码 | [2f13b7a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2f13b7a)

# [0.6.0](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.5.4...0.6.0) (2020-12-20)

### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复已知bug,版本升级至0.6.0 | [9a8be90](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9a8be90)
 - | 修复crud引用bug [@0](https://github.com/0).5.5 | [8570702](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8570702)

## [0.5.4](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.5.3...0.5.4) (2020-12-18)

### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复this.value初始值bug ,版本更新至0.5.4 | [5b32d30](https://github.com/BoBoooooo/Element-Pro-Crud/commit/5b32d30)


### 📝 文档
范围|描述|commitId
--|--|--
 - | update DOC | [c95fe9f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c95fe9f)

## [0.5.3](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.5.0...0.5.3) (2020-12-09)

### 🌟 新功能
范围|描述|commitId
--|--|--
 CrudTable | 新增btnAddVisibleFunc属性控制行内添加按钮是否显示 | [267369a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/267369a)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复删除接口传参Bug,版本升级至0.5.3 | [e1e4072](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e1e4072)
 - | 修复FIleUpload上传按钮显示bug [@0](https://github.com/0).5.2 | [7b25fdc](https://github.com/BoBoooooo/Element-Pro-Crud/commit/7b25fdc)
 - | 移除demo测试代码多余引入 | [6b9325d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6b9325d)

# [0.5.0](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.3.3...0.5.0) (2020-12-08)

### 🔨 代码重构
范围|描述|commitId
--|--|--
 - | 组件代码重构,修改组件注册方式 | [1d67c5d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1d67c5d)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 优化表单设计器默认配置项 | [2c96915](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2c96915)

## [0.3.3](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.3.2...0.3.3) (2020-12-08)

### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | axios token prefix bug | [c1aed5a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c1aed5a)


### 📝 文档
范围|描述|commitId
--|--|--
 - | update docs | [ec7ee69](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ec7ee69)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | 更新版本至0.3.3 | [e1c919b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e1c919b)
 CrudTable | tableTitle默认隐藏 | [75d4f57](https://github.com/BoBoooooo/Element-Pro-Crud/commit/75d4f57)
 - | 优化调试逻辑 | [30d8c1d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/30d8c1d)
 - | 组件代码优化 | [4023818](https://github.com/BoBoooooo/Element-Pro-Crud/commit/4023818)

## [0.3.2](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.3.1...0.3.2) (2020-11-27)

### chore
范围|描述|commitId
--|--|--
 docs,crud-table | [@0](https://github.com/0).3.2 修改README文档,新增dialogWidth,epmtyText属性,修复已知Bug | [7dcc25a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/7dcc25a)

## [0.3.1](https://github.com/BoBoooooo/Element-Pro-Crud/compare/0.3.0...0.3.1) (2020-11-26)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | 文本组件新增对齐方式/字体大小配置项 | [78388ac](https://github.com/BoBoooooo/Element-Pro-Crud/commit/78388ac)


### chore
范围|描述|commitId
--|--|--
 - | version update to 0.3.1 | [0748286](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0748286)

# [0.3.0](https://github.com/BoBoooooo/Element-Pro-Crud/compare/c003a89...0.3.0) (2020-11-23)

### 🌟 新功能
范围|描述|commitId
--|--|--
 - | [@0](https://github.com/0).2.4,修复表单设计器getData 多选情况下bug | [a8ec788](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a8ec788)
 FormDesign | 初步提交一版表单设计器 | [0161f67](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0161f67)
 FormDesigner | 级联选择器新增支持配置父子级联关系,version update to 0.2.2 | [40cd7d1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/40cd7d1)
 index | fix eslint bug | [a09ae6b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/a09ae6b)


### 🎨 代码样式
范围|描述|commitId
--|--|--
 - | 目录调整 | [05b3cca](https://github.com/BoBoooooo/Element-Pro-Crud/commit/05b3cca)
 - | 修改文件注释 | [915255a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/915255a)
 - | code style perf | [6c45fa1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/6c45fa1)
 - | code style perf | [8f285dd](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8f285dd)
 - | code style perf | [06051ef](https://github.com/BoBoooooo/Element-Pro-Crud/commit/06051ef)
 - | lint fix | [8422cc5](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8422cc5)


### 🏠 构建系统
范围|描述|commitId
--|--|--
 deps | bump http-proxy from 1.18.0 to 1.18.1 | [20151ba](https://github.com/BoBoooooo/Element-Pro-Crud/commit/20151ba)


### 🐛 Bug 修复
范围|描述|commitId
--|--|--
 - | 修复查询时间清空bug,版本升级至0.2.6 | [8bba911](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8bba911)
 - | 修复component name bug,版本升级至0.3.0 | [e6b5ef2](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e6b5ef2)
 - | 修复core-js版本Bug | [3e1f919](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3e1f919)
 - | 修复name漏写bug | [776a683](https://github.com/BoBoooooo/Element-Pro-Crud/commit/776a683)
 - | 修复vue-class-component组件导出name属性为undefined bug | [570e6db](https://github.com/BoBoooooo/Element-Pro-Crud/commit/570e6db)
 - | fix icons url bug | [46cd289](https://github.com/BoBoooooo/Element-Pro-Crud/commit/46cd289)
 - | update version to 0.2.1 , fix bug | [03451a6](https://github.com/BoBoooooo/Element-Pro-Crud/commit/03451a6)
 - | version update to 0.0.1-2, fix bug | [e51fae1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e51fae1)


### 📝 文档
范围|描述|commitId
--|--|--
 - | update docs | [aaaa01a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/aaaa01a)
 - | update docs | [5e60d42](https://github.com/BoBoooooo/Element-Pro-Crud/commit/5e60d42)
 - | update README | [20a1f7c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/20a1f7c)


### 📦 持续集成
范围|描述|commitId
--|--|--
 - | 修改eslint rule | [03fe86b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/03fe86b)
 - | add keywords | [cbb3488](https://github.com/BoBoooooo/Element-Pro-Crud/commit/cbb3488)
 - | update version to 0.1.0-1 | [e5cf3c1](https://github.com/BoBoooooo/Element-Pro-Crud/commit/e5cf3c1)
 - | update version to 0.1.0-1 | [070beed](https://github.com/BoBoooooo/Element-Pro-Crud/commit/070beed)


### 🚀 性能优化
范围|描述|commitId
--|--|--
 - | [@0](https://github.com/0).2.3 优化表单设计器组件交互性能 | [7651aa8](https://github.com/BoBoooooo/Element-Pro-Crud/commit/7651aa8)
 - | 版本升级至[@0](https://github.com/0).2.9 | [9c6659d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/9c6659d)
 - | 补充eslint依赖 | [1523e3a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/1523e3a)
 - | 采用v-bind $attrs v-on $listeners 处理多级props下发问题 | [cc10d54](https://github.com/BoBoooooo/Element-Pro-Crud/commit/cc10d54)
 - | 更改插件名称为: multifunction-crud | [8fe3018](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8fe3018)
 - | 同步本地最新代码 | [8f51560](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8f51560)
 - | 完善readme文档,优化lint文档 | [992d0c9](https://github.com/BoBoooooo/Element-Pro-Crud/commit/992d0c9)
 - | 修改高级查询表单宽度,避免横向滚动 | [40d8dbe](https://github.com/BoBoooooo/Element-Pro-Crud/commit/40d8dbe)
 - | 移除element-ui css 引入 | [766b0b5](https://github.com/BoBoooooo/Element-Pro-Crud/commit/766b0b5)
 - | 优化本地调试,支持直接进入umd.js | [99af656](https://github.com/BoBoooooo/Element-Pro-Crud/commit/99af656)
 - | 组件销毁时解绑eventBus | [2daa028](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2daa028)
 - | code perf | [436a18d](https://github.com/BoBoooooo/Element-Pro-Crud/commit/436a18d)
 - | lodash按需引入 | [94f00e3](https://github.com/BoBoooooo/Element-Pro-Crud/commit/94f00e3)
 - | some change | [8d2fe54](https://github.com/BoBoooooo/Element-Pro-Crud/commit/8d2fe54)
 - | some perf | [2b5cdeb](https://github.com/BoBoooooo/Element-Pro-Crud/commit/2b5cdeb)
 - | update package.json | [90d7463](https://github.com/BoBoooooo/Element-Pro-Crud/commit/90d7463)
 - | update version code | [0597d8c](https://github.com/BoBoooooo/Element-Pro-Crud/commit/0597d8c)
 - | update version to 0.1.1 | [eb43c9f](https://github.com/BoBoooooo/Element-Pro-Crud/commit/eb43c9f)
 - | update version to 0.2.0 | [336300a](https://github.com/BoBoooooo/Element-Pro-Crud/commit/336300a)
 - | update vue-expand.d.ts | [411cc10](https://github.com/BoBoooooo/Element-Pro-Crud/commit/411cc10)
 - | version update to 0.2.5 | [211ab70](https://github.com/BoBoooooo/Element-Pro-Crud/commit/211ab70)


范围|描述|commitId
--|--|--
 - | 0.1.6 | [44bae78](https://github.com/BoBoooooo/Element-Pro-Crud/commit/44bae78)
 - | 0.1.5 | [3b98e14](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3b98e14)
 - | 0.1.4 | [de2b378](https://github.com/BoBoooooo/Element-Pro-Crud/commit/de2b378)
 - | 0.1.3 | [fb3b5f9](https://github.com/BoBoooooo/Element-Pro-Crud/commit/fb3b5f9)
 - | Create .npmrc | [3ecfee9](https://github.com/BoBoooooo/Element-Pro-Crud/commit/3ecfee9)
 - | Update README.md | [c69ba5b](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c69ba5b)
 - | [feat](bobo-npm-plugin-test): 初始化项目,结合bobo-npm-plugin-test发布 | [c003a89](https://github.com/BoBoooooo/Element-Pro-Crud/commit/c003a89)


### 🔨 代码重构
范围|描述|commitId
--|--|--
 - | 调整目录结构,加入types声明文件 | [ab896f3](https://github.com/BoBoooooo/Element-Pro-Crud/commit/ab896f3)
 - | refactor some details | [742f6a6](https://github.com/BoBoooooo/Element-Pro-Crud/commit/742f6a6)


### chore
范围|描述|commitId
--|--|--
 - | 由于是umd打包发布,依赖全部并入devDependencies | [cf2ece3](https://github.com/BoBoooooo/Element-Pro-Crud/commit/cf2ece3)

