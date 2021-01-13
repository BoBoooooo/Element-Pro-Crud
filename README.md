
# 🎉 ElementProCrud 🎉

## [文档地址](http://crud.boboooooo.top)
## [在线demo](http://server.boboooooo.top:9999/crud)
## [集成demo](http://server.boboooooo.top:9999/admin)

## 特性
- 基于el-table,el-form二次封装,表单表格支持可视化配置
- 表单设计器
  - 基础组件: 内置element-ui表单组件
  - 高级组件: 
    - `级联选择器` (el-cascader)
    - `富文本编辑器` Tinymce
    - `附件模块` (FileUpload)
    - `表格模块` (CrudTable)
    - `树形下拉框` (vue-treeSelect)
    - `自定义插槽`
- 表格设计器 

## 核心依赖

``` javascript
  "dependencies": {
    "@riophae/vue-treeselect": "^0.4.0",
    "axios": "^0.19.2",
    "dayjs": "1.8.20",
    "element-ui": "^2.13.2",
    "lodash": "^4.17.14",
    "pinyin-match": "^1.0.9",
    "vue": "2.6.11",
    "vuedraggable": "^2.23.2"
  }
```

## 开始使用

### 安装

```
npm i element-pro-crud -S
```

### CDN

``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <!-- 引入ProCrud CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-pro-crud/lib/ProCrud.css" />
    <!-- 引入ElementUI CSS -->
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"
    />
  </head>
  <body>
    <div id="app">
      <el-button @click="showDialog('form')" type="primary">打开表单设计器</el-button>
      <el-button @click="showDialog('table')" type="danger">打开表格设计器</el-button>
      <form-designer-dialog ref="form"></form-designer-dialog>
      <table-designer-dialog ref="table"></table-designer-dialog>
      <crud-table tableName="dept" tableTitle="表格示例"></crud-table>
    </div>
  </body>
  <!-- import Vue before Element -->
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
  <!-- import ElementUI -->
  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <!-- import ElementProCrud -->
  <script src="https://cdn.jsdelivr.net/npm/element-pro-crud/lib/ProCrud.umd.js"></script>
  <script src="https://cdn.bootcdn.net/ajax/libs/ace/test/ace.js"></script>

  <script>
    new Vue({
      el: "#app",
      methods:{
        showDialog(name){
          this.$refs[name].showDialog();
        }
      }
    });
  </script>
</html>
  ```

### 引入 ElementProCrud

支持完整引入及按需引入,*该插件基于ElementUI封装,注意引用顺序*

#### 完整引入
  
  在 main.js 中写入以下内容：

  ```javascript
  import ElementProCrud from 'element-pro-crud';
  import ElementUI from 'element-ui';
  import 'element-pro-crud/lib/ProCrud.css'; // 先引入插件css,避免css污染
  import 'element-ui/lib/theme-chalk/index.css';

  Vue.use(ElementUI)
  Vue.use(ElementProCrud, {
    getTables: Function; // axios方法获取数据库中所有的表
    getFormKey: Function; // axios方法获取某张表中所有字段信息
    getFormDetail: Function;// 获取某个表单设计json
    getTableDetail: Function;// 获取某个表格设计json
    crud: (dml: DML, tableName: string, data?: object, params?: object)=> AxiosPromise; // 通用CRUD封装
  });
  ```
  
#### 按需引入
``` javascript
  import { GenerateForm } from 'element-pro-crud';
  Vue.use(GenerateForm);

  import Vue from 'vue';
  import { GenerateForm, CrudTable, FormDesigner, TableDesigner } from 'element-pro-crud';
  import App from './App.vue';

  Vue.use(GenerateForm); // 不需要传options
  Vue.use(CrudTable, options);// options介绍如上,getTables,getFormKey两个方法可以缺省
  Vue.use(FormDesigner, options);// options介绍如上
  Vue.use(TableDesigner, options);// options介绍如上

  new Vue({
    el: '#app',
    render: h => h(App)
  });

```

#### 完整组件列表

- `GenerateForm` // 根据表单设计器json自动渲染表单

- `FormDesigner` // 表单设计器

- `TableDesigner` // 表格设计器

- `CrudTable` // 高级增删改查 ProTable

## 组件文档

### CrudTable

#### Props

|          参数          |                               说明                                |      类型       |                 可选值                  |  默认值   |
| :--------------------: | :---------------------------------------------------------------: | :-------------: | :-------------------------------------: | :-------: |
| `el-table props` |          el-table原生属性见文档          |          https://element.eleme.cn/#/zh-CN/component/table            |
|       columns        |                       表格json置                        |     Object      |             -             | null |
|       searchMode        |                        查询区域模式                        |     String      |             popover/cover            | popover |
|       listField        |                        response 中数据位置                        |     String      |             data/data.list              | data.list |
|      readOnly       | GenerateFormDialog 中的表单禁用.null 表示均可编辑;{}表示全部只读; |     Boolean      |   true/false   |   false    |  |
|       isMultiple       |                           是否开启多选                            |     Boolean     |               true,false                |   false   |
|       emptyText        |                      列表数据为空时显示文字                       |     String      |                    -                    | 暂无数据  |
|        prefill         |                      表单预填项(赋值初始值)                       |     Object      |                    -                    |   null    |
|      dialogAppendToBody      |                 表单对话框是否插入至 body 元素上                  |     Boolean     |               true/false                |   true   |
|      dialogWidth      |                 表单宽度                 |     String     |               -                |   80%   |
|       tableName        |                               表名                                |     String      |                    -                    |    ''     |
|   tableDesignerName    |      用于请求表格设计 json 的 name,不传则默认读取 tableName       |     String      |                    -                    |   null    |
| dialogFormDesignerName |    对话框内加载 FormDesigner 的表名,,不传则默认读取 tableName     |     String      |                    -                    |   null    |
|     orderCondition     |                             排序条件                              |     String      |                    -                    |   null    |
|      visibleList       |                         内部元素显示控制(详情见下方)                          |     Object      |                    -                    |    {}     |
|       tableTitle       |                             表格标题                              |     String      |                    -                    |    ''     |
|      tableParams       |                   表格请求参数(带查询参数请求)                    |  Object,Array   |                    -                    |    {}     |
|        textMap         |                          表单对话框标题                           |     Object      | { add:'添加',edit:'编辑',detail:'查看'} |    {}     |
|     promiseForDel      |                    自定义删除按钮 promise 请求                    |    Function     |      Function(id)      |   -    |
|     promiseForDels      |                    自定义批量删除按钮 promise 请求                    |    Function     |      Function([id])      |   -    |
|    promiseForDetail    |                    详情 promise 请求                    |    Function     |                    (id: string):Object => formData                 |   -    |
|    promiseForSelect    |                    自定义列表查询 promise 请求                    |    Function     |                    Function(searchCondition, clearParams)                   |   -    |
|    promiseForSave    |                    自定义保存方法 promise 请求                    |    Function     |                    Function(formValue, status)                   |   -    |
|     btnAddOnClick      |                         添加按钮点击事件                          |    Function     |                    -                    |   -    |
|    btnRowAddOnClick    |                    表格行中的添加按钮点击事件                     |    Function     |                    Function(row)                    |   -    |
|     btnEditOnClick     |                         编辑按钮点击事件                          |    Function     |                    Function(row)                   |   -    |
|    btnDetailOnClick    |                         查看按钮点击事件                          |    Function     |                    Function(row)                   |    -     |
|    btnDelVisibleFunc    |                    表格行中的删除按钮是否显示事件                     |    Function     |                    Function(row)                    |   -    |
|    btnAddVisibleFunc    |                    表格行中的添加按钮是否显示事件                     |    Function     |                    Function(row)                    |   -    |
|    btnEditVisibleFunc    |                    表格行中的编辑按钮是否显示事件                     |    Function     |                    Function(row)                    |   -    |
|    btnDetailVisibleFunc    |                    表格行中的查看按钮是否显示事件                     |    Function     |                    Function(row)                    |   -    |
|     showPagination     |                      自定义列表 config 请求                       |     Boolean     |               true/false                |   true    |
|      remoteFuncs       |               远程数据方法(用于表单内远端数据请求)                |     Object      |                    -                    |    {}     |
|      pageSize          |                     动态传入分页                     | Array |                    -                    |   [10,50,100]    |
|      maxHeightMinus    |                     表格自适应高度需要减去的高度值                     | Number |                    -                    |   285    |
|      fullHeight        |                     是否自适应屏幕高度(配置MaxHeightMinus)                     | Boolean |                    -                    |   false    |
|      selectableFunc    |                     选择框动态判断是否显示                     | Function |                    -                    |   null   |
|      dialogFullscreen      |                     表单是否全屏                     | Boolean |                    -                    |  false    |
|      dialogCloseOnClickModal      |                    表单点击阴影是否可以关闭                     | Boolean |                    -                    |  false    |
|      showColumnIndex      |                     是否显示序号列                     | Boolean |                    -                    |   false    |
|      formTableConfig      |                     表单中表格的tableConfig                     | Object |                    -                    |   详情看GenerateFormItem中解释    |
|      formValuesAsync      |                     异步更新表单数据                     | Object |                    -                    |  外层异步传入数据更新表单,注意不能直接修改formValues    |
|      actionColumnWidth      |                     操作列宽度(有时需要直接指定列宽)                    | Number |                    -                    |  null    |
|      paginationLayout      |                     分页显示                     | String |   见官网   |  total, prev, pager, next, jumper, sizes    |

#### Props 补充说明

- `visibleList`

```
  // 内部元素显示控制
  {
    searchForm: true, // 查询区域
    tableTitle: false, // 表格标题
    btnAdd: true, // 添加按钮
    btnDel: false, // 批量删除按钮
    actionColumnBtnAdd: false, // 操作列添加按钮
    actionColumnBtnEdit: true, // 操作列编辑按钮
    actionColumnBtnDetail: false, // 操作列查看按钮
    actionColumnBtnDel: true, // 操作列删除按钮
    actionColumn: true, // 操作列
    seniorSearchBtn:true, // 高级查询按钮
    btnAddOnColumnHeader: false, // 操作列header添加按钮
  };
```

- `textMap`

```
// 按钮文字Map
{
  add: '添加',
  edit: '编辑',
  del: '删除',
  detail: '查看',
  multiDel: '批量删除'
}
```



#### Events

| 事件名称  |             说明             |                      回调参数                      |
| :-------: | :--------------------------: | :------------------------------------------------: |
| `el-table events` |          el-table原生事件见文档          |          https://element.eleme.cn/#/zh-CN/component/table            |
|   done    |       表格数据请求完成       |              整个 CrudTable 组件对象               |
| selection-change |           多选事件           |              选中的行 (params: Array)              |
|  form-change   | 监听 dialog 中 form 对象改变 | 返回当前表单对象以及当前表单 json (params: Object) |
| form-btn-on-click |           表单内按钮组件点击回调           |             widget(表单组件json)              |


#### Slots

|    插槽名称     |                   说明                   |
| :-------------: | :--------------------------------------: |
| columnFormatter | 结合表格设计自定义列使用 |
|  btnBarPrevBtn  |           自定义右上角功能按钮           |
|    btnCustom    |      自定义操作按钮 参数为 {row}     |
|    seniorSearchForm    |      自定义高级查询表单      |
|    dialogFooter    |      弹出表单右侧底部slot     |

#### Methods

|   方法名    |     说明     | 参数 |
| :---------: | :----------: | :--: |
| tableReload | 重新加载列表 |  -   |

#### TODO
- tree-select 懒加载
- 表单表格设计器 dev模式