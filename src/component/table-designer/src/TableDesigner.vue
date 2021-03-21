<!--
@file 表格设计对话框
@author BoBo
@copyright BoBo
@createDate 2020年03月02日12:12:17
-->
<template>
  <div>
    <!-- 对话框内动态表单 -->
    <el-row>
      <el-col :span="12">
        <el-form size="small" :inline="true" :model="objJSON" class="inline-form">
          <el-form-item label="表格名称">
            <el-select v-if="allTables" filterable allow-create v-model="objJSON.name" placeholder="名称">
              <el-option v-for="(item, index) in allTables" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
            <el-input v-else v-model="objJSON.name" placeholder="请输入表格名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="objJSON.position" placeholder="使用位置"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <!-- 菜单栏 -->
        <MenuBar style="float: right" :designedJSON.sync="objJSON" :fieldConfig="fieldConfig" :formList="formList" :minColumnWidth="minColumnWidth" />
      </el-col>
    </el-row>
    <el-table stripe fit ref="table" :data="objJSON.columns" style="width: 100%; margin-bottom: 20px" :row-key="(row) => row.id || row.prop" border>
      <!-- 遍历columns生成表头 -->
      <el-table-column header-align="center" align="center" :label="column.name" v-for="column in fieldConfig" :key="column.name" :min-width="column.headStyle">
        <template slot-scope="scope">
          <!-- 第一列只有排序图标 -->
          <template v-if="column.is === 'i'">
            <el-tooltip class="item" effect="dark" content="拖拽可以排序哦~" placement="left">
              <i style="color: blue; cursor: pointer" class="el-icon-sort"></i>
            </el-tooltip>
          </template>
          <!-- 只有文本框的列，“最小宽度”字段列特殊处理 -->
          <el-input
            v-if="column.is === 'input'"
            v-model="scope.row[column.field]"
            :placeholder="column.field"
            size="small"
            :class="{ notDefaultWidth: column.field === 'minWidth' && scope.row[column.field] !== 140 }"
          />
          <!-- 下拉菜单列 -->
          <el-select size="small" v-else-if="column.is === 'select'" v-model="scope.row[column.field]" :placeholder="column.field">
            <el-option v-for="o in column.list" :key="o.label" :label="o.label" :value="o.value"></el-option>
          </el-select>
          <!-- 开关 -->
          <el-switch size="small" v-else-if="column.is === 'switch'" v-model="scope.row[column.field]"></el-switch>
          <!-- 高级查询，如果配置了popover同时options存在就显示编辑 -->
          <el-popover v-else-if="column.is === 'popover' && scope.row[column.field]" placement="bottom-start" width="400" trigger="click">
            <!-- 下拉菜单配置 -->
            <SelectConfig :dictList="dictList" :sourceOption.sync="scope.row[column.field]" />
            <el-button size="small" slot="reference" type="primary"> 编辑菜单 </el-button>
          </el-popover>
          <el-button size="small" v-else-if="column.is === 'popover'" slot="reference" @click="addOptionToColumn(scope.$index)"> 转为菜单 </el-button>
          <!-- 操作列 -->
          <template v-if="column.is === 'action'">
            <el-tooltip class="item" effect="dark" content="删除当前行" placement="left">
              <i style="color: red; cursor: pointer" class="el-icon el-icon-delete" @click="removeColumn(scope.$index)"></i>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { DML } from '@/types/common';
import Sortable from 'sortablejs';
import MenuBar from './MenuBar.vue';
import columnsConfig from './columnsConfig.ts';
import SelectConfig from './SelectConfig.vue';

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
};

export default {
  name: 'TableDesigner',
  components: {
    MenuBar,
    SelectConfig,
  },
  props: {
    // 表名
    allTables: {
      type: Array,
      default: null,
    },
    // formList
    formList: {
      type: Array,
      default: () => [],
    },
    // 字典列表
    dictList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 对话框内文本框们填写的值
      formValues: {},
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
    };
  },
  mounted() {
    this.rowDrop();
  },
  methods: {
    // 行拖拽
    rowDrop() {
      const tbody = this.$refs.table.$el.querySelector('.el-table__body-wrapper tbody');
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.objJSON.columns.splice(oldIndex, 1)[0];
          _this.objJSON.columns.splice(newIndex, 0, currRow);
        },
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
    // 返回当前表格设计器对象
    getData() {
      return this.objJSON;
    },
    // 设置内部JSON
    setJSON(tableJson) {
      this.objJSON = tableJson;
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
  font-size: 14px;
}
code {
  display: block;
  margin-top: 20px;
}
</style>
