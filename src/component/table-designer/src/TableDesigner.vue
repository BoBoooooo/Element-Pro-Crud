<!--
 * @file:
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2021-01-07 11:33:05
-->
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
        <el-form size="small" :inline="true" :model="formValues" class="inline-form">
          <el-form-item label="表格名称">
            <el-select v-if="allTables" filterable allow-create v-model="formValues.tableName" placeholder="名称">
              <el-option v-for="(item, index) in allTables" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
            <el-input v-else v-model="formValues.tableName" placeholder="请输入表格名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formValues.position" placeholder="使用位置"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <!-- 菜单栏 -->
        <MenuBar style="float:right" :designedJSON.sync="objJSON" :fieldConfig="fieldConfig" :formList="formList" :minColumnWidth="minColumnWidth" />
      </el-col>
    </el-row>

    <table class="tableDesigner">
      <thead>
        <!-- 遍历columns生成表头 -->
        <th v-for="column in fieldConfig" :key="column.name" v-if="column.show">
          <el-tooltip v-if="column.tootip" class="item" effect="dark" :content="column.tootip" placement="top">
            <span>{{ column.name }}</span>
          </el-tooltip>
          <span v-else :style="column.headStyle">{{ column.name }}</span>
        </th>
      </thead>
      <!-- 包含可拖动元素的外部标签 -->
      <Draggable tag="tbody" v-model="objJSON.columns" handle=".el-icon-sort">
        <!-- 遍历生成每一行 -->
        <tr v-for="(item, index) in objJSON.columns" :key="index" class="row">
          <!-- 遍历生成一行中的每一个单元格 -->
          <td v-for="column in fieldConfig" :key="column.name" v-if="column.show && column.is">
            <!-- 第一列只有排序图标 -->
            <i v-if="column.is === 'i'" class="el-icon-sort"></i>
            <!-- 只有文本框的列，“最小宽度”字段列特殊处理 -->
            <el-input
              v-else-if="column.is === 'input'"
              v-model="item[column.field]"
              :placeholder="column.field"
              size="small"
              :class="{ notDefaultWidth: column.field === 'minWidth' && item[column.field] !== 140 }"
            />
            <!-- 下拉菜单列 -->
            <el-select size="small"  v-else-if="column.is === 'select'" v-model="item[column.field]" :placeholder="column.field">
              <el-option v-for="o in column.list" :key="o.label" :label="o.label" :value="o.value"></el-option>
            </el-select>
            <!-- 开关 -->
            <el-switch size="small" v-else-if="column.is === 'switch'" v-model="item[column.field]"></el-switch>
            <!-- 高级查询，如果配置了popover同时options存在就显示编辑 -->
            <el-popover v-else-if="column.is === 'popover' && item[column.field]" placement="bottom-start" width="400" trigger="click">
              <!-- 下拉菜单配置 -->
              <SelectConfig :dictList="dictList" :sourceOption.sync="item[column.field]" />
              <el-button size="small" slot="reference" type="primary">
                编辑菜单
              </el-button>
            </el-popover>
            <el-button size="small" v-else-if="column.is === 'popover'" slot="reference" @click="addOptionToColumn(index)">
              转为菜单
            </el-button>
          </td>
          <td>
            <el-tooltip class="item" effect="dark" content="删除当前行" placement="left">
              <i style="color: red;cursor:pointer" class="el-icon el-icon-delete" @click="removeColumn(index)"></i>
            </el-tooltip>
          </td>
        </tr>
      </Draggable>
    </table>
  </div>
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
  name: 'TableDesigner',
  components: {
    MenuBar,
    Draggable,
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
      this.objJSON.name = this.formValues.tableName;
      this.objJSON.position = this.formValues.position;
      return this.objJSON;
    },
    // 设置内部JSON
    setJSON(tableJson) {
      this.objJSON = tableJson;
      this.$set(this.formValues, 'tableName', tableJson.name);
      this.$set(this.formValues, 'position', tableJson.position);
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
