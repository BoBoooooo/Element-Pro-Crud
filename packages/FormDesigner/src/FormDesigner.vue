<!--
 * @file: 表单设计器
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年09月30 17:26:55
-->

<template>
  <div>
    <!-- 对话框内动态表单 -->
    <!-- <GenerateForm ref="generateDialogForm"
                  :value="formValues"
                  :data="formDesign"
                  :remote="remoteFuncs" /> -->
    <el-container style="height:calc(100% - 103px);border:1px solid gray">
      <!-- 左侧边栏 -->
      <el-aside style="width: 20%;max-width:250px">
        <div class="components-list">
          <div class="widget-cate">基础组件</div>
          <Draggable tag="ul"
                     :list="basicComponents"
                     v-bind="getDraggableOptions()"
                     .end="handleMoveEnd"
                     .start="handleMoveStart"
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
                     .end="handleMoveEnd"
                     .start="handleMoveStart"
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
                     .end="handleMoveEnd"
                     .start="handleMoveStart"
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
                   style="height: 45px;">
          <el-button type="text"
                     size="medium"
                     icon="el-icon-view"
                     @click="handlePreview">预览</el-button>
          <el-button type="text"
                     size="medium"
                     icon="el-icon-tickets"
                     @click="handleGenerateJson">生成JSON</el-button>

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
                style="width:25%;">
        <el-container>
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
      <!-- <cus-dialog :visible="previewVisible"
                  @on-close="previewVisible = false"
                  ref="widgetPreview"
                  .on-submit="handleTest"
                  width="1000px"
                  form>
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
      </cus-dialog> -->
      <!-- json对话框 -->
      <cus-dialog :visible="jsonVisible"
                  @on-close="jsonVisible = false"
                  ref="jsonPreview"
                  width="800px"
                  form>
        <!-- json编辑器 -->
        <div id="jsoneditor"
             style="height: 400px;width: 100%;">{{jsonTemplate}}</div>

        <template slot="action">
          <el-button id="copybtn"
                     data-clipboard-target=".ace_text-input">双击复制</el-button>
        </template>
      </cus-dialog>
    </el-container>
  </div>

</template>

<script>
import './element.js';
import Draggable from 'vuedraggable';
import Icon from 'vue-awesome/components/Icon.vue';
// eslint-disable-next-line
import JSONEditor from "jsoneditor";
// import Clipboard from 'clipboard';
import WidgetConfig from './components/FormDesigner/WidgetConfig.vue';
import FormConfig from './components/FormDesigner/FormConfig.vue';
// 最中心设计区域
import WidgetForm from './components/FormDesigner/WidgetForm.vue';
import CusDialog from './components/FormDesigner/CusDialog.vue';
// import GenerateForm from './components/FormDesigner/GenerateForm.vue';
import {
  basicComponents,
  layoutComponents,
  advanceComponents,
} from './components/FormDesigner/componentsConfig';
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
    // GenerateForm,
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
      // 对话框是否显示
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
  computed: {
    // 对话框标题
    dialogTitle() {
      return this.dialogStatus === 0 ? '添加表格' : '编辑表格';
    },
  },
  created() {
    this.formValues = {};
    this.widgetForm = {
      list: [],
      config: { labelWidth: 100, labelPosition: 'top', size: 'small' },
    };

    this.widgetFormSelect = '';
  },
  methods: {
    // 自动生成表单,默认一行两列
    autoGenerateFormByBackend(rows) {
      const formJson = {
        list: [],
        config: {
          labelWidth: 110,
          labelPosition: 'right',
          size: 'small',
          isTableClass: true,
        },
      };

      for (let i = 0; i < rows.length; i += 1) {
        let flag = false;
        const { COLUMN_COMMENT } = rows[i];
        // 遍历整个form
        const COLUMN_NAME = `${this.formKeys.prefill
          + rows[i].COLUMN_NAME.toLowerCase()}`;
        let COLUMN_NAME2 = null;
        let COLUMN_COMMENT2 = null;
        if (i + 1 <= rows.length && rows[i + 1]) {
          flag = true;

          COLUMN_COMMENT2 = rows[i + 1].COLUMN_COMMENT;
          // 遍历整个form
          COLUMN_NAME2 = `${this.formKeys.prefill
            + rows[i + 1].COLUMN_NAME.toLowerCase()}`;
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
      // this.$refs.generateForm
      //   .getData()
      //   .then((data) => {
      //     this.$alert(data, '').catch(() => {});
      //     this.$refs.widgetPreview.end();
      //   })
      //   .catch(() => {
      //     this.$refs.widgetPreview.end();
      //   });
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
@import './components/FormDesigner/styles/cover.scss';
@import './components/FormDesigner/styles/index.scss';

.widget-empty {
  background: url('./components/FormDesigner/form_empty.png') no-repeat;
  background-position: 50% 30%;
}
</style>
<style scoped>
.dialog >>> .el-dialog__body {
  height: calc(100% - 54px);
  padding: 0 10px;
}
</style>
