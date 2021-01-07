<!--
@file 动态表单设计器
      依赖vue-awesome、vuedraggable
@author BoBo
@copyright BoBo
@createDate 2018年11月15日16:11:09
-->
<template>
  <!-- 对话框 -->
  <el-dialog v-if="visible" ref="dialog" class="dialog" :visible.sync="visible" fullscreen append-to-body>
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
            <!-- 对话框内动态表单 -->
            <el-col :span="12" v-if="$PROCRUD.getTables">
              <GenerateForm ref="generateDialogForm" class="form" v-if="visible" hiddenDevModule :value="formValues" :data="formDesign" :remote="remoteFuncs" />
            </el-col>
            <el-col :span="$PROCRUD.getTables ? 12 : 24" style="text-align:right">
              <el-button type="text" size="medium" icon="el-icon-view" @click="handlePreview">预览</el-button>
              <el-button type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">导入JSON</el-button>
              <el-button type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">生成JSON</el-button>
              <el-button type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">生成代码</el-button>
              <el-button type="text" size="medium" icon="el-icon-delete" @click="handleClear">清空</el-button>
              <el-button type="text" size="medium" icon="el-icon-form" :disabled="!$PROCRUD.getTables" @click="formVisible = true">自动绑定</el-button>
              <el-button type="text" :disabled="!$PROCRUD.getTables" @click="btnSave_onClick" :loading="btnSaveIsLoading">保存</el-button>
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
      <cus-dialog :visible="previewVisible" @on-close="previewVisible = false" ref="widgetPreview" @on-submit="handleTest" width="1000px" form>
        <el-alert type="warning" :closable="false" style="margin-bottom:15px">组件依赖远端数据需要结合代码!</el-alert>
        <GenerateForm v-if="previewVisible" :data="widgetForm" :value="widgetModels" ref="generateForm">
          <template slot="blank" slot-scope="scope">
            宽度：<el-input v-model="scope.model.blank.width" style="width: 100px"></el-input> 高度：<el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </GenerateForm>
      </cus-dialog>
           <cus-dialog
            :visible="uploadVisible"
            @on-close="uploadVisible = false"
            @on-submit="handleUploadJson"
            ref="uploadJson"
            width="800px"
            form
          >
            <el-alert type="info" title="在此处导入json"></el-alert>
            <!-- json编辑器 -->
        <Editor
          height="400px"
          width="100%"
          ref="uploadeditor"
          :content="jsonEg"
          v-model="jsonEg"
          :options="{
            enableBasicAutocompletion: true,
            enableSnippets: true,
            wrap: 'free',
            enableLiveAutocompletion: true,
            tabSize: 2,
            fontSize: 15,
            showPrintMargin: false, //去除编辑器里的竖线
          }"
          :lang="'json'"
          @init="editorInit"
        >
        </Editor>
          </cus-dialog>
      <!-- json对话框 -->
      <cus-dialog :visible="jsonVisible" @on-close="jsonVisible = false" ref="jsonPreview" width="800px" form>
        <!-- json编辑器 -->
        <Editor
          height="400px"
          width="100%"
          ref="jsoneditor"
          :content="jsonTemplate"
          v-model="jsonTemplate"
          :options="{
            enableBasicAutocompletion: true,
            enableSnippets: true,
            wrap: 'free',
            enableLiveAutocompletion: true,
            tabSize: 2,
            fontSize: 15,
            showPrintMargin: false, //去除编辑器里的竖线
          }"
          :lang="'json'"
          @init="editorInit"
        >
        </Editor>
        <template slot="action">
          <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制JSON</el-button>
        </template>
      </cus-dialog>

      <cus-dialog :visible="codeVisible" @on-close="codeVisible = false" ref="codePreview" width="800px" form :action="false">
        <!-- <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div> -->
        <el-tabs type="border-card" style="box-shadow: none;" v-model="codeActiveName">
          <el-tab-pane label="Vue Component" name="vue">
            <!-- json编辑器 -->
            <Editor
              height="500px"
              width="100%"
              ref="jsoneditor"
              :content="vueTemplate"
              v-model="vueTemplate"
              :options="{
                enableBasicAutocompletion: true,
                enableSnippets: true,
                wrap: 'free',
                enableLiveAutocompletion: true,
                tabSize: 2,
                fontSize: 15,
                showPrintMargin: false, //去除编辑器里的竖线
              }"
              :lang="'html'"
              @init="editorInit"
            >
            </Editor>
          </el-tab-pane>
          <el-tab-pane label="HTML" name="html">
            <!-- json编辑器 -->
            <Editor
              height="500px"
              width="100%"
              ref="jsoneditor"
              :content="htmlTemplate"
              v-model="htmlTemplate"
              :options="{
                enableBasicAutocompletion: true,
                enableSnippets: true,
                wrap: 'free',
                enableLiveAutocompletion: true,
                tabSize: 2,
                fontSize: 15,
                showPrintMargin: false, //去除编辑器里的竖线
              }"
              :lang="'html'"
              @init="editorInit"
            >
            </Editor>
          </el-tab-pane>
        </el-tabs>
      </cus-dialog>
      <cus-dialog
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
            <el-option v-for="(item, index) in allTables" :key="index" size="small" :label="item.TABLE_NAME" :value="item.TABLE_NAME"></el-option>
          </el-select>
          <el-button type="success" size="small" style="float: right;margin-top: 10px" @click="handleGenerateKey(true)">自动生成表单</el-button>
        </template>
        <template v-else>
          <p>
            初始化时请先设置getTables方法
          </p>
        </template>
      </cus-dialog>
    </el-container>
  </el-dialog>
</template>

<script>
import SvgIcon from '@/icons/SvgIcon.vue';
import { DML } from '@/types/common';
import Draggable from 'vuedraggable';
import Icon from 'vue-awesome/components/Icon.vue';
import Clipboard from 'clipboard';
import Editor from 'vue2-ace-editor';
import WidgetConfig from './WidgetConfig.vue';
import FormConfig from './FormConfig.vue';
// 最中心设计区域
import CusDialog from './CusDialog.vue';
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
  name: 'FormDesignerDialog',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm,
    Icon,
    SvgIcon,
    Editor,
  },
  data() {
    return {
      remoteFuncs: {
        getTablesOfDB: (resolve) => {
          // 请求表名列表
          this.$PROCRUD.getTables().then((res) => {
            const options = res.data.map(item => ({
              label: item.TABLE_NAME,
              value: item.TABLE_NAME,
            }));
            resolve(options);
          });
        },
      },
      // 对话框内文本框们填写的值
      formValues: {},
      // 对话框设计结构json
      formDesign: {},
      visible: false,
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
      jsonEg: '',
      formKeys: {
        tableName: '',
        prefill: '',
        // 成功自动识别的字段
        success: [],
      },
      // 数据库所有表
      allTables: null,
    };
  },
  methods: {
    editorInit() {
      require('brace/ext/language_tools');
      require('brace/mode/html');
      require('brace/mode/json');
      require('brace/snippets/json');
      require('brace/snippets/html');
      require('brace/theme/chrome');
    },
    setJSON(json) {
      this.widgetForm = json;

      if (json.list.length > 0) {
        [this.widgetFormSelect] = json.list;
      }
    },
    handleUpload() {
      this.uploadVisible = true;
    },
    handleUploadJson() {
      try {
        this.setJSON(JSON.parse(this.jsonEg));
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

      console.log(JSON.stringify(this.widgetForm));
      this.$nextTick(() => {
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
    },
    // 自动同步后端key
    async handleGenerateKey(generateForm = false) {
      this.formKeys.success = [];
      const res = await this.$PROCRUD.getFormKey(this.formKeys.tableName);
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
    /**
     * 显示对话框，父元素调用
     *
     * @param {Object} param 对话框保存时的参数
     * @param {Number} status 对话框状态[添加:0,编辑:1]，必须是STATUS枚举
     * @param {Object} formValues 编辑时传入所有字段的默认值
     */
    async showDialog(param = {}, status = STATUS.CREATE, formValues = {}) {
      // 保存参数用于save方法
      this.dialogParams = param;
      this.dialogStatus = status;
      if (this.dialogStatus === STATUS.UPDATE) {
        // 填写编辑框，这里如果不用...拷贝会导致污染实参
        this.formValues = { ...formValues };
        // 下方设计区域
        this.widgetForm = JSON.parse(formValues.formJson);
      } else {
        this.formValues = {};
        this.widgetForm = {
          list: [],
          config: { labelWidth: 140, labelPosition: 'right', size: 'small' },
        };
      }
      // 初始化右侧的配置区域
      this.widgetFormSelect = {};
      // 请求数据库所有表名
      if (this.$PROCRUD.getTables) {
        const { data } = await this.$PROCRUD.getTables();
        this.allTables = data;
      }

      // 请求对话框内的动态表单json
      if (this.$PROCRUD.getFormDetail) {
        const res = await this.$PROCRUD.getFormDetail('dynamictables');
        this.formDesign = JSON.parse(res.data.formJson);
      }
      this.visible = true;
    },
    // 保存设计
    btnSave_onClick() {
      this.btnSaveIsLoading = true;
      // 调用此方法验证表单数据和获取表单数据
      this.$refs.generateDialogForm
        .getData()
        .then((formValue) => {
          const value = JSON.parse(formValue.formJson);
          value.config.name = formValue.tableName;
          formValue.formJson = JSON.stringify(value);
          let type;
          let msg;
          // 根据对话框状态判断保存或编辑
          if (this.dialogStatus === STATUS.CREATE) {
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
            promise = this.$PROCRUD.crud(type, 'form', opt);
          }
          promise
            .then(() => {
              this.btnSaveIsLoading = false;
              this.$message({
                type: 'success',
                message: msg,
              });
              this.visible = false;
              this.$emit('after-save', {
                status: this.dialogStatus,
                dialogParams: this.dialogParams,
                formDesign: this.widgetForm,
              });
            })
            .catch(() => {
              this.btnSaveIsLoading = false;
            });
        })
        .catch((err) => {
          console.log(err);
          // 数据校验失败
          this.btnSaveIsLoading = false;
        });
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
