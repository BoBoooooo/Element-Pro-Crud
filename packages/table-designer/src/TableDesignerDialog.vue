<!--
@file 表格设计对话框
@author ytyang
@copyright BoBo
@createDate 2018年12月8日19:28:09
-->
<template>
  <!-- 对话框 -->
  <el-dialog v-if="visible"
             ref="dialog"
             top="10vh"
             class="dialog"
             :visible.sync="visible"
             width="95%"
             append-to-body>
    <!-- 对话框内动态表单 -->
    <GenerateForm ref="generateDialogForm"
                  :value="formValues"
                  :entity.sync="entity"
                  :data="formDesign"
                  :remote="remoteFuncs"
                  style="float:left;width:50%" />
    <!-- 菜单栏 -->
    <MenuBar style="float:right"
             :designedJSON.sync="objJSON"
             :fieldConfig="fieldConfig"
             :minColumnWidth="minColumnWidth" />
    <table class="tableDesigner">
      <thead>
        <!-- 遍历columns生成表头 -->
        <th v-for="(column) in fieldConfig"
            :key="column.name"
            v-if="column.show">
          <el-tooltip v-if="column.tootip"
                      class="item"
                      effect="dark"
                      :content="column.tootip"
                      placement="top">
            <span>{{column.name}}</span>
          </el-tooltip>
          <span v-else
                :style="column.headStyle">{{column.name}}</span>
        </th>
      </thead>
      <!-- 包含可拖动元素的外部标签 -->
      <Draggable tag="tbody"
                 v-model="objJSON.columns"
                 handle='.el-icon-sort'>
        <!-- 遍历生成每一行 -->
        <tr v-for="(item, index) in objJSON.columns"
            :key="index"
            class="row">
          <!-- 遍历生成一行中的每一个单元格 -->
          <td v-for="(column) in fieldConfig"
              :key="column.name"
              v-if="column.show&&column.is">
            <!-- 第一列只有排序图标 -->
            <i v-if="column.is==='i'"
               class="el-icon-sort"></i>
            <!-- 只有文本框的列，“最小宽度”字段列特殊处理 -->
            <el-input v-else-if="column.is==='input'"
                      v-model="item[column.field]"
                      :placeholder="column.field"
                      :class="{notDefaultWidth:column.field==='minWidth'
                      &&item[column.field]!==140}" />
            <!-- 下拉菜单列 -->
            <el-select v-else-if="column.is==='select'"
                       v-model="item[column.field]"
                       :placeholder="column.field">
              <el-option v-for="o in column.list"
                         :key="o.label"
                         :label="o.label"
                         :value="o.value"></el-option>
            </el-select>
            <!-- 开关 -->
            <el-switch v-else-if="column.is==='switch'"
                       v-model="item[column.field]"></el-switch>
            <!-- 高级查询，如果配置了popover同时options存在就显示编辑 -->
            <el-popover v-else-if="column.is==='popover'&&item[column.field]"
                        placement="bottom-start"
                        width="400"
                        trigger="click">
              <!-- 下拉菜单配置 -->
              <SelectConfig :sourceOption.sync="item[column.field]" />
              <el-button slot="reference"
                         type="primary">
                编辑菜单
              </el-button>

            </el-popover>
            <el-button v-else-if="column.is==='popover'"
                       slot="reference"
                       @click="addOptionToColumn(index)">
              转为菜单
            </el-button>
          </td>
          <td>
            <el-tooltip class="item"
                        effect="dark"
                        content="删除当前行"
                        placement="left">
              <el-button type="danger"
                         size="small"
                         icon="el-icon-delete"
                         @click="removeColumn(index)"></el-button>
            </el-tooltip>
          </td>
        </tr>
      </Draggable>
    </table>
    <code>
      <b>表格配置规则</b><br>
      1.操作列插槽默认为actionColumn,自定义列插槽为columnFormatter<br>
      2.支持通过表单设计json自动生成表格
    </code>
    <!-- 底部按钮栏 -->
    <el-row type="flex"
            justify="end">
      <el-button type="primary"
                 icon="el-icon-check"
                 @click="btnSave_onClick()"
                 :loading="btnSaveIsLoading">保存</el-button>
      <el-button icon="el-icon-close"
                 @click="btnCancel_onClick()">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import Draggable from 'vuedraggable';
import { DML } from '@/types/common';
import MenuBar from './MenuBar.vue';
import columnsConfig from './columnsConfig.ts';
import SelectConfig from './SelectConfig.vue';

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
};

export default {
  name: 'TableDesignerDialog',
  components: {
    MenuBar,
    Draggable,
    SelectConfig,
  },
  props: {
    // 表名
    tableName: {
      type: String,
      default: 'dynamictables',
    },
    // 覆盖保存的promise
    promiseForSave: {
      type: Function,
      // 默认必须为null用于后期判断是否传入
      default: null,
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
      // 表格设计json
      objJSON: {
        columns: [],
      },
      // 设计列隐藏
      fieldConfig: columnsConfig,
      // 保存按钮Loading状态
      btnSaveIsLoading: false,
      // 最小列宽度
      minColumnWidth: 140,
      // 获取表单实体
      entity: {},
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
    };
  },
  methods: {
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
        // 下方表格加载json
        this.objJSON = JSON.parse(formValues.formJson);
      } else {
        this.formValues = {};
        this.objJSON = {
          columns: [],
        };
      }
      // 请求对话框内的动态表单json
      const res = await this.$PROCRUD.getFormDetail(this.tableName);
      this.formDesign = JSON.parse(res.data.formJson);
      this.visible = true;
    },
    // 取消按钮点击
    btnCancel_onClick() {
      this.visible = false;
      this.$emit('cancel');
    },
    // 保存按钮点击
    btnSave_onClick() {
      this.btnSaveIsLoading = true;
      // 调用此方法验证表单数据和获取表单数据
      this.$refs.generateDialogForm
        .getData()
        .then((formValue) => {
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
            promise = this.$PROCRUD.crud(type, this.tableName, opt);
          }

          promise.then(() => {
            this.btnSaveIsLoading = false;
            this.visible = false;
            this.$message({
              type: 'success',
              message: msg,
            });
            this.$emit('after-save', {
              status: this.dialogStatus,
              dialogParams: this.dialogParams,
              tableDesign: JSON.parse(formValue.formJson),
            });
          });
        })
        .catch(() => {
          // 数据校验失败
          this.btnSaveIsLoading = false;
        });
    },
    // 删除列
    removeColumn(index) {
      this.objJSON.columns.splice(index, 1);
    },
    // 把高级查询为文本框的字段转为下拉菜单
    addOptionToColumn(index) {
      this.$set(this.objJSON.columns[index], 'option', {
        remote: 'static',
        remoteFunc: '',
        type: 'select',
        props: {
          value: '',
          label: '',
        },
      });
    },
  },
  watch: {
    objJSON: {
      handler(newValue) {
        // 修改设计时json同步变化
        this.$set(this.formValues, 'formJson', JSON.stringify(newValue));
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.notDefaultWidth >>> .el-input__inner {
  color: black;
  font-weight: bold;
}
.row:hover >>> .el-input__inner {
  background-color: #fffdf8;
  border: 1px solid #ffc107;
}
.dialog >>> .el-dialog__body {
  height: 100%;
}
.dialog >>> .el-dialog__header {
  padding: 0;
}
.dialog >>> .el-dialog__headerbtn {
  top: 5px;
  right: 10px;
  border: 1px solid gray;
  background: #fffbd7;
  color: black;
  z-index: 100;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tableDesigner {
  width: 100%;
}
code {
  display: block;
  margin-top: 20px;
}
</style>
