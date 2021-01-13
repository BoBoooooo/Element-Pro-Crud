<!--
@file 动态表单设计器
      依赖vue-awesome、vuedraggable
@author BoBo
@copyright BoBo
@createDate 2018年11月15日16:11:09
-->
<template>
    <!-- 对话框 -->
    <el-container style="height:100%">
      <!-- 左侧边栏 -->
      <el-aside style="width: 20%;max-width:250px">
        <div class="components-list">
          <div class="logo-container">
            <SvgIcon icon-class="logo" class="logo"></SvgIcon>
            <span class="title">
              Form Generate
            </span>
          </div>
          <div class="widget-cate">基础组件</div>
          <Draggable tag="ul" :list="basicComponents" v-bind="getDraggableOptions()" @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">
            <li class="form-edit-widget-label" v-for="(item, index) in basicComponents" :key="index">
              <a>
                <Icon class="icon" :name="item.icon"></Icon>
                <span>{{ item.name }}</span>
              </a>
            </li>
          </Draggable>
          <div class="widget-cate">高级组件</div>
          <Draggable tag="ul" :list="advanceComponents" v-bind="getDraggableOptions()" @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">
            <li class="form-edit-widget-label" v-for="(item, index) in advanceComponents" :key="index">
              <a>
                <Icon class="icon" :name="item.icon"></Icon>
                <span>{{ item.name }}</span>
              </a>
            </li>
          </Draggable>
          <div class="widget-cate">布局组件</div>
          <Draggable tag="ul" :list="layoutComponents" v-bind="getDraggableOptions()" @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">
            <li
              class="form-edit-widget-label"
              :class="{
                'data-grid': item.name !== '分割线',
              }"
              v-for="(item, index) in layoutComponents"
              :key="index"
            >
              <a>
                <Icon class="icon" :name="item.icon"></Icon>
                <span>{{ item.name }}</span>
              </a>
            </li>
          </Draggable>
        </div>
      </el-aside>
      <!-- 中间区域 -->
      <el-container class="center-container" direction="vertical">
        <!-- 中间区域顶部按钮栏 -->
        <el-header class="btn-bar" style="height: 60px;">
          <el-row :gutter="15">
            <el-col :span="24" style="text-align:right;margin-top:5px">
              <el-button type="primary" size="small" icon="el-icon-view" @click="handlePreview">预览</el-button>
              <el-button type="primary" size="small" icon="el-icon-upload2" @click="handleUpload">导入JSON</el-button>
              <el-button type="primary" size="small" icon="el-icon-tickets" @click="handleGenerateJson">生成JSON</el-button>
              <el-button type="primary" size="small" icon="el-icon-document" @click="handleGenerateCode">生成代码</el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="handleClear">清空</el-button>
              <el-button type="normal" size="small" icon="el-icon-form" :disabled="!(allTables && getFormKey)" @click="formVisible = true">自动绑定</el-button>
              <slot name="custom-btn"></slot>
            </el-col>
          </el-row>
        </el-header>
        <!-- 中间区域中央设计区域，data:widgetForm用于保存生成后的json -->
        <el-main :class="{ 'widget-empty': widgetForm.list.length == 0 }">
          <WidgetForm ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></WidgetForm>
        </el-main>
      </el-container>
      <!-- 右侧边栏 -->
      <el-aside class="widget-config-container" style="width:300px;">
        <el-container class="full-height">
          <el-header height="45px" style="width: 300px">
            <div class="config-tab" :class="{ active: configTab == 'widget' }" @click="handleConfigSelect('widget')">
              字段属性
            </div>
            <div class="config-tab" :class="{ active: configTab == 'form' }" @click="handleConfigSelect('form')">
              表单属性
            </div>
          </el-header>
          <el-main class="config-content">
            <WidgetConfig v-show="configTab == 'widget'" :elementConfig="widgetFormSelect"></WidgetConfig>
            <FormConfig v-show="configTab == 'form'" :data="widgetForm.config"></FormConfig>
          </el-main>
        </el-container>
      </el-aside>
      <!-- 预览对话框 -->
      <CusDialog :visible="previewVisible" @on-close="previewVisible = false" ref="widgetPreview" @on-submit="handleTest" width="1000px" form>
        <el-alert type="warning" :closable="false" style="margin-bottom:15px">组件依赖远端数据需要结合代码!</el-alert>
        <GenerateForm v-if="previewVisible" :data="widgetForm" :value="widgetModels" ref="generateForm">
          <template slot="blank" slot-scope="scope">
            宽度：<el-input v-model="scope.model.blank.width" style="width: 100px"></el-input> 高度：<el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </GenerateForm>
      </CusDialog>
      <CusDialog :visible="uploadVisible" @on-close="uploadVisible = false" @on-submit="handleUploadJson" ref="uploadJson" width="800px" form>
        <el-alert type="info" title="在此处导入JSON"></el-alert>
        <div id="uploadeditor" style="height: 400px;width: 100%;">{{ jsonEg }}</div>
      </CusDialog>

      <CusDialog :visible="jsonVisible" @on-close="jsonVisible = false" ref="jsonPreview" width="800px" form>
        <div id="jsoneditor" style="height: 400px;width: 100%;">{{ jsonTemplate }}</div>

        <template slot="action">
          <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制JSON</el-button>
        </template>
      </CusDialog>

      <CusDialog :visible="codeVisible" @on-close="codeVisible = false" ref="codePreview" width="800px" form :action="false">
        <!-- <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div> -->
        <el-tabs type="border-card" style="box-shadow: none;" v-model="codeActiveName">
          <el-tab-pane label="Vue Component" name="vue">
            <div id="vuecodeeditor" style="height: 500px; width: 100%;">{{ vueTemplate }}</div>
          </el-tab-pane>
          <el-tab-pane label="HTML" name="html">
            <div id="codeeditor" style="height: 500px; width: 100%;">{{ htmlTemplate }}</div>
          </el-tab-pane>
        </el-tabs>
      </CusDialog>
      <CusDialog
        ref="bindKeys"
        :visible="formVisible"
        title="绑定后端key/自动初始化表单(根据数据库字段备注)"
        @on-close="
          formVisible = false;
          formKeys.tableName = '';
          formKeys.prefill = '';
        "
        width="800px"
        :action="false"
      >
        <template v-if="allTables">
          <el-select v-model="formKeys.tableName" filterable style="width:100%" placeholder="选择数据源">
            <el-option v-for="(item, index) in allTables" :key="index" size="small" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="success" size="small" style="float: right;margin-top: 10px" @click="handleGenerateKey(true)">自动生成表单</el-button>
        </template>
        <template v-else>
          <p>
            初始化时请先设置getTables方法
          </p>
        </template>
      </CusDialog>
    </el-container>
</template>

<script>
import SvgIcon from '@/icons/SvgIcon.vue';
import { DML } from '@/types/common';
import Draggable from 'vuedraggable';
import Icon from 'vue-awesome/components/Icon.vue';
import Clipboard from 'clipboard';
import CusDialog from '@/component/common/CusDialog.vue';
import WidgetConfig from './WidgetConfig.vue';
import FormConfig from './FormConfig.vue';
// 最中心设计区域
import GenerateForm from './GenerateForm.vue';
import { basicComponents, layoutComponents, advanceComponents } from './componentsConfig';
import WidgetForm from './WidgetForm.vue';
import 'vue-awesome/icons/regular/keyboard';
import 'vue-awesome/icons/sign';
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
import 'vue-awesome/icons/file-word';
import generateCode from './generateCode.js';

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
};

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
    SvgIcon,
  },
  props: {
    allTables: {
      type: Array,
      default: null,
    },
    getFormKey: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      // 表单名/使用位置
      formValues: {
        tableName: '',
        position: '',
      },
      basicComponents,
      layoutComponents,
      advanceComponents,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 140,
          labelPosition: 'top',
          columnList: [],
        },
      },
      configTab: 'widget',
      widgetFormSelect: null,
      // 预览 对话框显示/隐藏
      previewVisible: false,
      // 生成json 对话框显示/隐藏
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      // 绑定formKeys表单是否显示
      formVisible: false,
      htmlTemplate: '',
      vueTemplate: '',
      widgetModels: {},
      codeActiveName: 'vue',
      jsonCopyValue: '',
      jsonClipboard: null,
      // json编辑器内的文本
      jsonTemplate: '',
      uploadEditor: null,
      jsonEg: `{
        "list": [],
        "config": {
          "labelWidth": 100,
          "labelPosition": "top",
          "size": "small"
        }
      }`,
      formKeys: {
        tableName: '',
        prefill: '',
        // 成功自动识别的字段
        success: [],
      },
      dialogStatus: null,
    };
  },
  methods: {
    // 返回当前表单设计器对象
    getData() {
      this.widgetForm.name = this.formValues.tableName;
      this.widgetForm.position = this.formValues.position;
      return this.widgetForm;
    },
    setJSON(json) {
      this.widgetForm = json;
      this.$set(this.formValues, 'tableName', json.name);
      this.$set(this.formValues, 'position', json.position);
      if (json.list.length > 0) {
        [this.widgetFormSelect] = json.list;
      }
    },
    handleUpload() {
      this.uploadVisible = true;
      this.$nextTick(() => {
        this.uploadEditor = ace.edit('uploadeditor');
        this.uploadEditor.session.setMode('ace/mode/json');
      });
    },
    handleUploadJson() {
      try {
        this.setJSON(JSON.parse(this.uploadEditor.getValue()));
        this.uploadVisible = false;
      } catch (e) {
        this.$message.error(e.message);
        this.$refs.uploadJson.end();
      }
    },
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
        const COLUMN_NAME = `${this.formKeys.prefill + rows[i].COLUMN_NAME.toLowerCase()}`;
        let COLUMN_NAME2 = null;
        let COLUMN_COMMENT2 = null;
        if (i + 1 <= rows.length && rows[i + 1]) {
          flag = true;

          COLUMN_COMMENT2 = rows[i + 1].COLUMN_COMMENT;
          // 遍历整个form
          COLUMN_NAME2 = `${this.formKeys.prefill + rows[i + 1].COLUMN_NAME.toLowerCase()}`;
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
    handleGenerateJson() {
      this.jsonVisible = true;
      this.jsonTemplate = JSON.stringify(this.widgetForm, null, 2);

      this.$nextTick(() => {
        const editor = ace.edit('jsoneditor');
        editor.session.setMode('ace/mode/json');

        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard('.json-btn');
          this.jsonClipboard.on('success', (e) => {
            this.$message.success('复制成功');
          });
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm);
      });
    },
    handleGenerateCode() {
      this.codeVisible = true;
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html');
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue');
      this.$nextTick(() => {
        const editor = ace.edit('codeeditor');
        editor.session.setMode('ace/mode/html');
        const vueeditor = ace.edit('vuecodeeditor');
        vueeditor.session.setMode('ace/mode/html');
      });
    },
    // 自动同步后端key
    async handleGenerateKey(generateForm = false) {
      this.formKeys.success = [];
      const res = await this.getFormKey(this.formKeys.tableName);
      if (generateForm) {
        this.autoGenerateFormByBackend(res.data);
        this.$alert('成功表格(默认为一行两列)');
      } else {
        for (const row of res.data) {
          const { COLUMN_COMMENT } = row;
          // 遍历整个form
          const COLUMN_NAME = `${this.formKeys.prefill + row.COLUMN_NAME.toLowerCase()}`;
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
    handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 140,
          labelPosition: 'right',
          size: 'small',
          customClass: '',
        },
      };

      this.widgetFormSelect = {};
    },
  },
};
</script>

<style lang="scss">
@import './styles/cover.scss';
@import './styles/index.scss';

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
