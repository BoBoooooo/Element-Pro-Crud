<!--
@file 动态表单设计器
      依赖vue-awesome、vuedraggable
@author BoBo
@copyright BoBo
@createDate 2018年11月15日16:11:09
-->
<template>
  <el-container style="height: 100%">
    <el-header height="54px" class="header">
      <div class="logo-container">
        <SvgIcon icon-class="logo" class="logo"></SvgIcon>
        <span class="title"> Form Generate </span>
      </div>
      <!-- 选择设备型号 -->
      <div class="device-bar btn-bar">
        <el-button
          type="primary"
          class="device-btn button"
          size="small"
          icon="el-icon-monitor"
          @click="setDeviceMode('pc')"
          :class="{
            active: deviceMode === 'pc',
          }"
        ></el-button>
        <el-button
          type="primary"
          class="button"
          size="small"
          icon="el-icon-mobile"
          @click="setDeviceMode('pad')"
          :class="{
            active: deviceMode === 'pad',
          }"
        ></el-button>
        <el-button
          type="primary"
          size="small"
          class="device-btn button"
          icon="el-icon-mobile-phone"
          @click="setDeviceMode('mobile')"
          :class="{
            active: deviceMode === 'mobile',
          }"
        ></el-button>
      </div>
      <div class="btn-bar">
        <el-button
          type="primary"
          size="small"
          class="button"
          icon="el-icon-picture-outline"
          @click="changeMode('design')"
          :class="{
            active: currentMode === 'design',
          }"
          >布局模式</el-button
        >
        <el-button
          type="primary"
          size="small"
          class="button"
          icon="el-icon-view"
          @click="changeMode('preview')"
          :class="{
            active: currentMode === 'preview',
          }"
          >预览模式</el-button
        >
        <el-divider direction="vertical"></el-divider>
        <el-button class="button" type="primary" size="small" icon="el-icon-upload2" @click="handleUpload">导入JSON</el-button>
        <el-button class="button" type="primary" size="small" icon="el-icon-tickets" @click="handleGenerateJson">生成JSON</el-button>
        <el-button class="button" type="primary" size="small" icon="el-icon-document" @click="handleGenerateCode">生成代码</el-button>
        <el-button class="button" type="danger" size="small" icon="el-icon-delete" @click="handleClear">清空</el-button>
        <el-tooltip placement="bottom" effect="dark">
          <div slot="content">需传入getFormKey方法,详见文档</div>
          <div style="display: inline-block">
            <el-button class="button" type="normal" size="small" icon="el-icon-attract" :disabled="!(allTables && getFormKey)" @click="formVisible = true">自动绑定</el-button>
          </div>
        </el-tooltip>
        <slot name="custom-btn"></slot>
      </div>
    </el-header>
    <!-- 主体区域 -->
    <el-container style="height: calc(100% - 54px)">
      <!-- 左侧边栏 -->
      <el-aside style="width: 20%; max-width: 250px">
        <div class="components-list">
          <div class="widget-cate">表单组件</div>
          <Draggable :clone="handleClone" tag="ul" :list="basicComponents" v-bind="getDraggableOptions()" :move="handleMove">
            <li class="form-edit-widget-label" v-for="(item, index) in basicComponents" :key="index" @click="addWidget(item)">
              <div>
                <Icon class="icon" :name="item.icon"></Icon>
                <span>{{ item.name }}</span>
              </div>
            </li>
          </Draggable>
          <div class="widget-cate">高级/异步组件</div>
          <Draggable :clone="handleClone" tag="ul" :list="advanceComponents" v-bind="getDraggableOptions()" :move="handleMove">
            <li class="form-edit-widget-label" v-for="(item, index) in advanceComponents" :key="index" @click="addWidget(item)">
              <div>
                <Icon class="icon" :name="item.icon"></Icon>
                <span>{{ item.name }}</span>
              </div>
            </li>
          </Draggable>
          <div class="widget-cate">布局组件</div>
          <Draggable :clone="handleClone" tag="ul" :list="layoutComponents" v-bind="getDraggableOptions()" :move="handleMove">
            <li
              class="form-edit-widget-label"
              :class="{
                'data-grid': item.name !== '分割线',
              }"
              v-for="(item, index) in layoutComponents"
              :key="index"
              @click="addWidget(item)"
            >
              <div>
                <el-badge value="beta" class="badge" v-if="item.beta">
                  <Icon class="icon" :name="item.icon"></Icon>
                  <span>{{ item.name }}</span></el-badge
                >
                <template v-else>
                  <Icon class="icon" :name="item.icon"></Icon>
                  <span>{{ item.name }}</span>
                </template>
              </div>
            </li>
          </Draggable>
          <div class="widget-cate">基础图表</div>
          <Draggable :clone="handleClone" tag="ul" :list="chartComponents" v-bind="getDraggableOptions()" :move="handleMove">
            <li class="form-edit-widget-label" v-for="(item, index) in chartComponents" :key="index" @click="addWidget(item)">
              <div>
                <Icon class="icon" :name="item.icon"></Icon>
                <span>{{ item.name }}</span>
              </div>
            </li>
          </Draggable>
        </div>
      </el-aside>
      <!-- 中间区域 -->
      <el-container class="center-container" direction="vertical">
        <!-- 中间区域中央设计区域，data:widgetForm用于保存生成后的json -->
        <el-main :class="{ 'widget-empty': widgetForm.list.length == 0 }">
          <WidgetForm :deviceMode="deviceMode" v-if="currentMode === 'design'" ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></WidgetForm>
          <template v-else>
            <el-alert type="warning" :closable="false" style="margin-bottom: 15px">异步及依赖远端数据的组件需要结合代码!</el-alert>
            <ProForm :deviceMode="deviceMode" :data="widgetForm" :value="widgetModels" ref="proForm"> </ProForm>
            <el-button size="small" style="float: right; margin-top: 15px" type="primary" @click="handleTest">获取表单数据</el-button>
          </template>
        </el-main>
      </el-container>
      <!-- 右侧边栏 -->
      <el-aside class="widget-config-container" style="width: 300px">
        <el-container style="height: 100%">
          <el-header height="45px" style="width: 300px">
            <div class="config-tab" :class="{ active: configTab == 'widget' }" @click="handleConfigSelect('widget')">字段属性</div>
            <div class="config-tab" :class="{ active: configTab == 'form' }" @click="handleConfigSelect('form')">表单属性</div>
          </el-header>
          <el-main class="config-content">
            <WidgetConfig v-show="configTab == 'widget'" v-if="widgetFormSelect && Object.keys(widgetFormSelect).length > 0" :dictType="dictType" :elementConfig="widgetFormSelect"></WidgetConfig>
            <FormConfig v-show="configTab == 'form'" :data="widgetForm.config"></FormConfig>
          </el-main>
        </el-container>
      </el-aside>
      <!-- 导入JSON对话框 -->
      <CusDialog :visible="uploadVisible" @on-close="uploadVisible = false" @on-submit="handleUploadJson" ref="uploadJson" width="800px" form>
        <el-alert type="info" title="在此处导入JSON"></el-alert>
        <div id="uploadeditor" style="height: 400px; width: 100%">{{ jsonEg }}</div>
      </CusDialog>
      <!-- 查看JSON对话框 -->
      <CusDialog :visible="jsonVisible" @on-close="jsonVisible = false" ref="jsonPreview" width="800px" form>
        <div id="jsoneditor" style="height: 400px; width: 100%">{{ jsonTemplate }}</div>

        <template slot="action">
          <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制JSON</el-button>
        </template>
      </CusDialog>
      <!-- 生成代码对话框 -->
      <CusDialog :visible="codeVisible" @on-close="codeVisible = false" ref="codePreview" width="800px" form :action="false">
        <!-- <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div> -->
        <el-tabs type="border-card" style="box-shadow: none" v-model="codeActiveName">
          <el-tab-pane label="Vue Component" name="vue">
            <div id="vuecodeeditor" style="height: 500px; width: 100%">{{ vueTemplate }}</div>
          </el-tab-pane>
          <el-tab-pane label="HTML" name="html">
            <div id="codeeditor" style="height: 500px; width: 100%">{{ htmlTemplate }}</div>
          </el-tab-pane>
        </el-tabs>
      </CusDialog>
      <!-- 自动绑定对话框 -->
      <CusDialog
        v-if="allTables"
        ref="bindKeys"
        :visible="formVisible"
        title="自动生成表单(根据数据库表字段及备注自动生成)"
        @on-close="
          formVisible = false;
          formKeys.tableName = '';
        "
        width="800px"
        :action="false"
      >
        <el-select v-model="formKeys.tableName" filterable style="width: 100%" placeholder="选择数据源">
          <el-option v-for="(item, index) in allTables" :key="index" size="small" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="success" size="small" style="float: right; margin-top: 10px" @click="handleGenerateKey(true)">自动生成表单</el-button>
      </CusDialog>
    </el-container>
  </el-container>
</template>

<script>
import SvgIcon from '@/icons/SvgIcon.vue';
import Draggable from 'vuedraggable';
import Icon from 'vue-awesome/components/Icon.vue';
import Clipboard from 'clipboard';
import CusDialog from '@/component/common/CusDialog.vue';
import { generateTd, random } from '@/utils/generator';
import ProForm from '@/component/pro-form/src/ProForm';
import WidgetConfig from './WidgetConfig.vue';
import FormConfig from './FormConfig.vue';
// 最中心设计区域
import { basicComponents, layoutComponents, advanceComponents, chartComponents } from './componentsConfig';
import WidgetForm from './WidgetForm.vue';
// 导入左侧组件面板图标
import './icon';
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
    ProForm,
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
    dictType: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 表单名/使用位置
      basicComponents,
      layoutComponents,
      advanceComponents,
      chartComponents,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 140,
          labelPosition: 'right',
          columnList: [],
        },
      },
      configTab: 'form',
      widgetFormSelect: {},
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
          "labelPosition": "right",
          "size": "small"
        }
      }`,
      formKeys: {
        tableName: '',
        // 成功自动识别的字段
        success: [],
      },
      dialogStatus: null,
      // 当前设计模式
      currentMode: 'design',
      // 当前设备
      deviceMode: 'pc',
    };
  },
  methods: {
    // 切换设备型号
    setDeviceMode(mode) {
      this.deviceMode = mode;
    },
    // 切换布局
    changeMode(mode) {
      this.currentMode = mode;
    },
    // 点击添加组件
    addWidget(item) {
      this.widgetForm.list.push(this.handleClone(item));
    },
    // 深拷贝防止拖拽clone后污染原组件,统一给所有拖拽出来的组件设置key,model
    handleClone(origin) {
      const {
        type = 'type',
        options: { remoteOptions },
      } = origin;
      const key = `${type}_${random()}`;
      const cloneOrigin = JSON.parse(
        JSON.stringify({
          ...origin,
          key,
          model: key,
          rules: [],
        }),
      );
      if (remoteOptions) {
        cloneOrigin.options.remoteFunc = `func_${key}`;
      }
      if (cloneOrigin.options.placeholder !== undefined) {
        cloneOrigin.options.placeholder = `请填写${cloneOrigin.name}`;
      }
      // 如果为表格布局,默认添加一个 <td></td>
      if (type === 'grid-table') {
        cloneOrigin.rows[0].columns.push(generateTd());
      }
      return cloneOrigin;
    },
    // 返回当前表单设计器对象
    getData() {
      return this.widgetForm;
    },
    setJSON(json) {
      this.widgetForm = json;
      if (json.list.length > 0) {
        [this.widgetFormSelect] = json.list;
      }
    },
    // 导入json
    handleUpload() {
      this.uploadVisible = true;
      this.$nextTick(() => {
        this.uploadEditor = ace.edit('uploadeditor');
        this.uploadEditor.session.setMode('ace/mode/json');
      });
    },
    // 导入json
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
    autoProFormByBackend(rows) {
      const formJson = {
        list: [],
        config: {
          labelWidth: 140,
          labelPosition: 'right',
          size: 'small',
        },
      };

      for (let i = 0; i < rows.length; i += 1) {
        let flag = false;
        const { COLUMN_COMMENT } = rows[i];
        // 遍历整个form
        const COLUMN_NAME = `${rows[i].COLUMN_NAME.toLowerCase()}`;
        let COLUMN_NAME2 = null;
        let COLUMN_COMMENT2 = null;
        if (i + 1 <= rows.length && rows[i + 1]) {
          flag = true;

          COLUMN_COMMENT2 = rows[i + 1].COLUMN_COMMENT;
          // 遍历整个form
          COLUMN_NAME2 = `${rows[i + 1].COLUMN_NAME.toLowerCase()}`;
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
          key: `grid_${random()}`,
          model: `grid_${random()}`,
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
                placeholder: `请填写${COLUMN_COMMENT}`,
                remoteFunc: 'func_1575516931000_89639',
              },
              key: `1575516931000_${Math.random()}`,
              model: COLUMN_NAME,
              rules: [
                {
                  type: 'string',
                  message: `${COLUMN_COMMENT}格式不正确`,
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
        // 分组设置
        group: {
          name: 'people',
          pull: 'clone',
          put: false,
        },
        // 禁止组内拖动
        sort: false,
        ghostClass: 'ghost',
      };
    },
    // 字段配置还是表单配置
    handleConfigSelect(value) {
      this.configTab = value;
    },
    handleMove() {
      return true;
    },
    // 预览点确定获取表单数据
    handleTest() {
      this.$refs.proForm
        .getData()
        .then((data) => {
          this.$alert(data, '').catch(() => {});
        })
        .catch((err) => {
          this.$alert(JSON.stringify(err), '').catch(() => {});
        });
    },
    // 生成json
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
    // 生成代码
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
    // 自动绑定
    async handleGenerateKey() {
      this.formKeys.success = [];
      const res = await this.getFormKey(this.formKeys.tableName);
      this.autoProFormByBackend(res.data);
      this.$message('生成成功');
      this.formVisible = false;
    },
    // 清空按钮
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
    widgetFormSelect(val) {
      if (val) {
        this.configTab = 'widget';
      }
    },
  },
};
</script>

<style lang="scss">
@import './styles/cover.scss';
@import './styles/index.scss';
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
.el-divider--vertical {
  background: #333;
}
</style>
