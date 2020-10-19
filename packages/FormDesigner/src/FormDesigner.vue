<!--
@file 动态表单设计器
      依赖vue-awesome、vuedraggable
@author BoBo
@copyright NanJing Anshare Tech .Com
@createDate 2018年11月15日16:11:09
-->
<template>
  <el-container style="height:100%">
    <!-- 左侧边栏 -->
    <el-aside style="width: 20%;max-width:250px">
      <div class="components-list">
        <div class="logo-container">
          <img class="logo"
               src="./logo.png" />
          <span class="title">
            Form Generate
          </span>
        </div>
        <div class="widget-cate">基础组件</div>
        <Draggable tag="ul"
                   :list="basicComponents"
                   v-bind="getDraggableOptions()"
                   @end="handleMoveEnd"
                   @start="handleMoveStart"
                   :move="handleMove">
          <li class="form-edit-widget-label"
              v-for="(item, index) in basicComponents"
              :key="index">
            <a>
              <Icon class="icon"
                    :name="item.icon"></Icon>
              <span>{{item.name}}</span>
            </a>
          </li>
        </draggable>
        <div class="widget-cate">高级组件</div>
        <Draggable tag="ul"
                   :list="advanceComponents"
                   v-bind="getDraggableOptions()"
                   @end="handleMoveEnd"
                   @start="handleMoveStart"
                   :move="handleMove">
          <li class="form-edit-widget-label"
              v-for="(item, index) in advanceComponents"
              :key="index">
            <a>
              <Icon class="icon"
                    :name="item.icon"></Icon>
              <span>{{item.name}}</span>
            </a>
          </li>
        </draggable>
        <div class="widget-cate">布局组件</div>
        <Draggable tag="ul"
                   :list="layoutComponents"
                   v-bind="getDraggableOptions()"
                   @end="handleMoveEnd"
                   @start="handleMoveStart"
                   :move="handleMove">
          <li class="form-edit-widget-label data-grid"
              v-for="(item, index) in layoutComponents"
              :key="index">
            <a>
              <Icon class="icon"
                    :name="item.icon"></Icon>
              <span>{{item.name}}</span>
            </a>
          </li>
        </draggable>
      </div>
    </el-aside>
    <!-- 中间区域 -->
    <el-container class="center-container"
                  direction="vertical">
      <!-- 中间区域顶部按钮栏 -->
      <el-header class="btn-bar"
                 style="height: 60px;">
        <el-row :gutter="15">
          <!-- 对话框内动态表单 -->
          <el-col :span="16">
              <GenerateForm ref="generateDialogForm"
                            class="form"
                            :value="formValues"
                            :data="formDesign"
                            :remote="remoteFuncs" />
            </el-col>
          <el-col :span="8" style="text-align:right">
            <!-- <el-button type='text'
                       @click="btnSave_onClick"
                       :loading="btnSaveIsLoading">保存</el-button> -->
            <el-button type="text"
                       size="medium"
                       icon="el-icon-view"
                       @click="handlePreview">预览</el-button>
            <el-button type="text"
                       size="medium"
                       icon="el-icon-tickets"
                       @click="handleGenerateJson">JSON</el-button>
            <el-button type="text"
                       size="medium"
                       icon="el-icon-form"
                       @click="formVisible = true">自动绑定</el-button>
          </el-col>
        </el-row>

      </el-header>
      <!-- 中间区域中央设计区域，data:widgetForm用于保存生成后的json -->
      <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
        <widget-form ref="widgetForm"
                     :data="widgetForm"
                     :select.sync="widgetFormSelect"></widget-form>
      </el-main>
    </el-container>
    <!-- 右侧边栏 -->
    <el-aside class="widget-config-container"
              style="width:300px;">
      <el-container class="full-height">
        <el-header height="45px">
          <div class="config-tab"
               :class="{active: configTab=='widget'}"
               @click="handleConfigSelect('widget')">字段属性</div>
          <div class="config-tab"
               :class="{active: configTab=='form'}"
               @click="handleConfigSelect('form')">表单属性</div>
        </el-header>
        <el-main class="config-content">
          <widget-config v-show="configTab=='widget'"
                         :data="widgetFormSelect"></widget-config>
          <form-config v-show="configTab=='form'"
                       :data="widgetForm.config"></form-config>
        </el-main>
      </el-container>

    </el-aside>
    <!-- 预览对话框 -->
    <cus-dialog :visible="previewVisible"
                @on-close="previewVisible = false"
                ref="widgetPreview"
                @on-submit="handleTest"
                width="1000px"
                form>
      <el-alert type="warning"
                :closable="false"
                class="mb-15">组件依赖远端数据需要结合代码实际预览,此处无法直接预览效果!</el-alert>
      <generate-form v-if="previewVisible"
                     :data="widgetForm"
                     :remote="remoteFuncsForPreview"
                     :value="widgetModels"
                     ref="generateForm">
        <template slot="blank"
                  slot-scope="scope">
          宽度：<el-input v-model="scope.model.blank.width"
                    style="width: 100px"></el-input>
          高度：<el-input v-model="scope.model.blank.height"
                    style="width: 100px"></el-input>
        </template>
      </generate-form>
    </cus-dialog>
    <!-- json对话框 -->
    <cus-dialog :visible="jsonVisible"
                @on-close="jsonVisible = false"
                ref="jsonPreview"
                width="800px"
                form>
      <!-- json编辑器 -->
      <div id="jsoneditor"
           style="height: 400px;width: 100%;">{{jsonTemplate}}</div>
    </cus-dialog>
    <cus-dialog ref="bindKeys"
                :visible="formVisible"
                title="绑定后端key/自动初始化表单(根据数据库字段备注)"
                @on-close="formVisible = false;formKeys.tableName = '';formKeys.prefill = ''"
                width="800px"
                :action="false">
      <el-alert type="warning">请先选择数据源,然后根据需要选择相应功能</el-alert>
      <table class="el-table"
             style="width:100%">
        <thead>
          <th>数据源</th>

        </thead>
        <tbody>
          <td>
            <el-select v-model="formKeys.tableName"
                       filterable
                       style="width:100%"
                       placeholder="选择数据源">
              <el-option v-for="(item,index) in allTables"
                         :key="index"
                         :label="item.TABLE_NAME"
                         :value="item.TABLE_NAME"></el-option>
            </el-select>
          </td>
        </tbody>
      </table>
      <el-button type="success"
                 @click="handleGenerateKey(true)">自动生成表单(根据数据库字段初始化,默认一行两列)</el-button>
      <!-- <el-button type="primary"
                   @click="handleGenerateKey()">自动绑定key(已有表单的情况)</el-button> -->
    </cus-dialog>
  </el-container>
</template>

<script>
import './element';

import Draggable from 'vuedraggable';
import Icon from 'vue-awesome/components/Icon.vue';
import JSONEditor from 'jsoneditor';
import { DML, crud } from '../../api/public/crud';
import { getTables, getFormKey, getFormDetail } from '../../api/system/form';
import WidgetConfig from './WidgetConfig.vue';
import FormConfig from './FormConfig.vue';
// 最中心设计区域
import CusDialog from './CusDialog.vue';
import GenerateForm from './GenerateForm.vue';
import {
  basicComponents,
  layoutComponents,
  advanceComponents,
} from './componentsConfig';
import WidgetForm from './WidgetForm.vue';
import 'vue-awesome/icons/regular/keyboard';
import 'vue-awesome/icons/regular/trash-alt';
import 'vue-awesome/icons/regular/clone';
import 'vue-awesome/icons/regular/dot-circle';
import 'vue-awesome/icons/regular/check-square';
import 'vue-awesome/icons/bars';
import 'vue-awesome/icons/clock';
import 'vue-awesome/icons/regular/calendar-alt';
import 'vue-awesome/icons/regular/clock';
import 'vue-awesome/icons/th';
import 'vue-awesome/icons/sort-numeric-up';
import 'vue-awesome/icons/regular/star';
import 'vue-awesome/icons/palette';
import 'vue-awesome/icons/regular/caret-square-down';
import 'vue-awesome/icons/toggle-off';
import 'vue-awesome/icons/sliders-h';
import 'vue-awesome/icons/regular/image';
import 'vue-awesome/icons/chalkboard';
import 'vue-awesome/icons/upload';
import 'vue-awesome/icons/comment';
import 'vue-awesome/icons/tree';
import 'vue-awesome/icons/random';
import 'vue-awesome/icons/text-width';
import 'vue-awesome/icons/mouse-pointer';
import 'jsoneditor/dist/jsoneditor.min.css';

export default {
  name: 'FormDesigner',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm,
    Icon,
  },
  props: {
    // 表名
    tableName: {
      type: String,
      default: '',
    },
    // 远程数据方法
    remoteFuncs: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 对话框内文本框们填写的值
      formValues: {},
      // 对话框设计结构json
      formDesign: {},
      // 保存按钮Loading状态
      btnSaveIsLoading: false,
      // ---------------以下为原来的代码--------------
      basicComponents,
      layoutComponents,
      advanceComponents,
      // 用于保存生成后的json，至少要有空结构，初始化时必须赋值
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'top',
          columnList: [],
        },
      },
      configTab: 'widget',
      widgetFormSelect: '',
      // 预览 对话框显示/隐藏
      previewVisible: false,
      // 生成json 对话框显示/隐藏
      jsonVisible: false,
      // 绑定formKeys表单是否显示
      formVisible: false,
      // 用于预览的下拉菜单数据
      remoteFuncsForPreview: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: '1', name: '1111' },
              { id: '2', name: '2222' },
              { id: '3', name: '3333' },
            ];

            resolve(options);
          }, 2000);
        },
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      // json编辑器内的文本
      jsonTemplate: '',
      formKeys: {
        tableName: '',
        prefill: '',
        // 成功自动识别的字段
        success: [],
      },
      // 数据库所有表
      allTables: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 自动生成表单,默认一行两列
    autoGenerateFormByBackend(rows) {
      const formJson = {
        list: [],
        config: {
          labelWidth: 140,
          labelPosition: 'right',
          size: 'small',
          isTableClass: true,
        },
      };

      for (let i = 0; i < rows.length; i += 1) {
        let flag = false;
        const { COLUMN_COMMENT } = rows[i];
        // 遍历整个form
        const COLUMN_NAME = `${
          this.formKeys.prefill + rows[i].COLUMN_NAME.toLowerCase()
        }`;
        let COLUMN_NAME2 = null;
        let COLUMN_COMMENT2 = null;
        if (i + 1 <= rows.length && rows[i + 1]) {
          flag = true;

          COLUMN_COMMENT2 = rows[i + 1].COLUMN_COMMENT;
          // 遍历整个form
          COLUMN_NAME2 = `${
            this.formKeys.prefill + rows[i + 1].COLUMN_NAME.toLowerCase()
          }`;
          i += 1;
        }
        const row = {
          type: 'grid',
          name: '栅格布局',
          icon: 'th',
          columns: [],
          options: {
            gutter: 0,
            justify: 'start',
            align: 'top',
            remoteFunc: 'func_1575516929000_36539',
          },
          key: `1575516931000_${Math.random()}`,
          model: '1575516929000_36539',
          rules: [],
        };
        const td = {
          span: 12,
          list: [
            {
              type: 'input',
              name: COLUMN_COMMENT,
              labelWidth: 0,
              hidden: false,
              icon: 'regular/keyboard',
              options: {
                width: '100%',
                defaultValue: '',
                readonly: false,
                disabled: false,
                required: false,
                dataType: 'string',
                pattern: '',
                placeholder: '',
                remoteFunc: 'func_1575516931000_89639',
              },
              key: `1575516931000_${Math.random()}`,
              model: COLUMN_NAME,
              rules: [
                {
                  type: 'string',
                  message: '单行文本格式不正确',
                },
              ],
            },
          ],
        };
        row.columns.push(td);
        if (flag) {
          const td2 = JSON.parse(JSON.stringify(td));
          td2.list[0].name = COLUMN_COMMENT2;
          td2.list[0].model = COLUMN_NAME2;
          td2.list[0].key = `1575516931000_${Math.random()}`;
          row.columns.push(td2);
        }
        formJson.list.push(row);
      }
      this.widgetForm = formJson;
    },
    getDraggableOptions() {
      return {
        group: {
          name: 'people',
          pull: 'clone',
          put: false,
        },
        sort: false,
        ghostClass: 'ghost',
      };
    },
    handleConfigSelect(value) {
      this.configTab = value;
    },
    handleMoveEnd(evt) {
      console.log('end', evt);
    },
    handleMoveStart({ oldIndex }) {
      console.log('start', oldIndex, this.basicComponents);
    },
    handleMove() {
      return true;
    },
    // 预览按钮
    handlePreview() {
      this.previewVisible = true;
    },
    handleTest() {
      this.$refs.generateForm
        .getData()
        .then((data) => {
          this.$alert(data, '').catch(() => {});
          this.$refs.widgetPreview.end();
        })
        .catch(() => {
          this.$refs.widgetPreview.end();
        });
    },
    // 生成JSON按钮
    handleGenerateJson() {
      this.jsonVisible = true;
      // 生成后的json赋值给json编辑器
      this.jsonTemplate = this.widgetForm;
      // 对话框生成后
      this.$nextTick(() => {
        // 初始化编辑器？
        // eslint-disable-next-line
        const editor = ace.edit("jsoneditor");
        // 设置编辑器模式？
        // editor.session.setMode('ace/mode/json');
        // 复制到剪贴板按钮？
        // const btnCopy = new Clipboard('#copybtn');
      });
    },
    // 自动同步后端key
    async handleGenerateKey(generateForm = false) {
      this.formKeys.success = [];
      const res = await getFormKey(this.formKeys.tableName);
      if (generateForm) {
        this.autoGenerateFormByBackend(res.data);
        this.$alert('成功表格(默认为一行两列)');
      } else {
        for (const row of res.data) {
          const { COLUMN_COMMENT } = row;
          // 遍历整个form
          const COLUMN_NAME = `${
            this.formKeys.prefill + row.COLUMN_NAME.toLowerCase()
          }`;
          this.generateModle(this.widgetForm.list, COLUMN_COMMENT, COLUMN_NAME);
        }
        this.$alert(`识别成功以下字段:${this.formKeys.success.join(',')}`);
        this.$refs.bindKeys.end();
      }
      this.formVisible = false;
    },

    // 表单动态切换显示隐藏
    generateModle(list, name, model) {
      // 遍历设计的结构
      for (let i = 0; i < list.length; i += 1) {
        if (list[i].type === 'grid') {
          list[i].columns.forEach((item) => {
            this.generateModle(item.list, name, model);
          });
        } else {
          const obj = list[i];
          // 如果找到该组件并且后端key还未设置
          if (obj.name === name && obj.model.includes(1)) {
            // 抛出结果,意见区域显示在表单下方
            this.formKeys.success.push(obj.name);
            obj.model = model;
          }
        }
      }
    },
    /**
     * 显示对话框，父元素调用
     *
     * @param {Object} param 对话框保存时的参数
     * @param {Number} status 对话框状态[添加:0,编辑:1]，必须是STATUS枚举
     * @param {Object} formValues 编辑时传入所有字段的默认值
     */
    init(param = {}, status = 0, formValues = {}) {
      // 保存参数用于save方法
      this.dialogParams = param;
      this.dialogStatus = status;
      getTables().then((res) => {
        this.allTables = res.data;
      });
      // 请求对话框内的动态表单json
      getFormDetail('dynamictables').then((res) => {
        this.formDesign = JSON.parse(res.data.formJson);
        if (this.dialogStatus === 1) {
          // 填写编辑框，这里如果不用...拷贝会导致污染实参
          this.formValues = { ...formValues };
          // 下方设计区域
          this.widgetForm = JSON.parse(formValues.formJson);
        } else {
          this.formValues = {};
          this.widgetForm = {
            list: [],
            config: { labelWidth: 100, labelPosition: 'top', size: 'small' },
          };
        }
        // 初始化右侧的配置区域
        this.widgetFormSelect = '';
      });
    },
    // 保存设计
    btnSave_onClick() {
      this.btnSaveIsLoading = true;
      // 调用此方法验证表单数据和获取表单数据
      this.$refs.generateDialogForm
        .getData()
        .then((formValue) => {
          let type;
          let msg;

          // 根据对话框状态判断保存或编辑
          if (this.dialogStatus === 0) {
            type = DML.INSERT;
            msg = '添加成功';
          } else {
            type = DML.UPDATE;
            msg = '编辑成功';
          }
          let promise;
          const opt = {
            ...formValue,
            ...this.dialogParams,
          };
          // 如果有代理的保存方法
          if (this.promiseForSave) {
            promise = this.promiseForSave(opt);
          } else {
            promise = crud(type, 'form', opt);
          }

          promise
            .then(() => {
              this.btnSaveIsLoading = false;
              this.$message({
                type: 'success',
                message: msg,
              });
              this.$emit('afterSave', {
                status: this.dialogStatus,
                dialogParams: this.dialogParams,
              });
            })
            .catch(() => {
              this.btnSaveIsLoading = false;
            });
        })
        .catch(() => {
          // 数据校验失败
          this.btnSaveIsLoading = false;
        });
    },
  },
  watch: {
    widgetForm: {
      handler(newValue) {
        // 修改设计时json同步变化
        this.$set(this.formValues, 'formJson', JSON.stringify(newValue));
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
@import "./styles/cover.scss";
@import "./styles/index.scss";

.widget-empty {
  background: url("~./form_empty.png") no-repeat;
  background-position: 50% 30%;
}
.logo-container {
  padding: 0 10px 10px;
  border-bottom: 1px solid #f2f2f2;
  .logo {
    width: 36px;
    height: 36px;
    display: inline-block;
  }
  .title {
    font-size: 24px;
    vertical-align: top;
    margin-left: 10px;
    color: #9e9e9e;
    line-height: 40px;
    display: inline-block;
  }
}
</style>
<style scoped>
.dialog >>> .el-dialog__body {
  height: 100%;
  padding: 0;
}
.dialog >>> .el-dialog__header {
  padding: 0;
}
.dialog >>> .el-dialog__headerbtn {
  top: 13px;
  right: 10px;
  border: 1px solid gray;
  background: #fffbd7;
  color: black;
  z-index: 100;
}
.form {
  margin-top: 6px;
}
</style>
