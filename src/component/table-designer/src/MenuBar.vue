<!--
@file 表格设计页面菜单栏
@author ytyang
@copyright BoBo
@createDate 2018年12月26日11:30:16
-->
<template>
  <el-container>
    <!-- 添加列 -->
    <el-dropdown @command="addColumn">
      <el-button size="small">
        添加列<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="addColumn">添加1行普通列</el-dropdown-item>
        <el-dropdown-item command="addColumnx10">添加10行普通列</el-dropdown-item>
        <el-dropdown-item command="addActionColumn">添加操作列</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 自动设置 -->
    <el-dropdown @command="autoSet">
      <el-button size="small">
        自动设置<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="generateTableByForm">
          [请先设置表单]根据表单生成表格
        </el-dropdown-item>
        <el-dropdown-item command="autoSetSearchable">
          检索状态：除了操作列，默认所有列都可以作为查询条件。
        </el-dropdown-item>
        <el-dropdown-item command="autoSetAlign">
          对齐方式：表头居中，数字靠右、变长靠左
        </el-dropdown-item>
        <el-dropdown-item command="autoSetSearchOption">
          [请先设置表单]分析表单配置以设置表格高级搜索options
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
      <el-select v-model="selectedForm"
                size="small"
                 v-if="formList.length>0"
                 placeholder="请选择表单"
                 filterable>
        <el-option v-for="(form, index) in formList"
                   :key="index"
                   :label="form.tableName"
                   :value="form.tableName"></el-option>
      </el-select>
  </el-container>
</template>

<script>
import _forEach from 'lodash/forEach';
import _pick from 'lodash/pick';
import { DML } from '@/types/common';

export default {
  name: 'MenuBar',
  data() {
    return {
      // 选中的表名
      selectedForm: null,
      // 所有动态表单json
      formList: [],
    };
  },
  props: {
    // 表格设计json
    designedJSON: {
      type: Object,
      default: () => ({
        columns: [],
      }),
    },
    minColumnWidth: {
      type: Number,
      default: 140,
    },
  },
  created() {
    this.$PROCRUD.crud(DML.SELECT, 'form').then((res) => {
      this.formList = res.data.list;
    });
  },
  methods: {
    autoSetSearchOption() {
      if (this.selectedForm == null) {
        this.$message({
          type: 'info',
          message: '请先选择表单',
        });
      }
      this.$PROCRUD.getFormDetail(this.selectedForm).then((res) => {
        if (res.data !== null) {
          const jsonObj = JSON.parse(res.data.formJson);
          const done = [];
          // 遍历行
          _forEach(jsonObj.list, (row) => {
            // 遍历列
            _forEach(row.columns, (column) => {
              const first = column.list[0];
              if (first && 'date,select'.includes(first.type)) {
                // 从表单复制到表格的属性
                const keyList = [
                  'type',
                  'format',
                  'width',
                  'placeholder',
                  'remote',
                  'remoteFunc',
                  // 'remoteOptions',
                  'dictType',
                  'props',
                  'options',
                ];
                const option = _pick(first.options, keyList);
                option.type = first.type;
                // 遍历当前表格配置，加入option
                for (const col of this.designedJSON.columns) {
                  if (
                    col.prop === `${first.model}dict`
                        || col.prop === first.model
                  ) {
                    this.$set(col, 'option', option);
                  }
                }
                done.push(first.name);
              }
            });
          });
          this.$notify({
            title: `${done.length}个字段已完成高级查询设置`,
            message: `${done.join(',')}已添加option`,
            duration: 5000,
          });
        } else {
          this.$message({
            type: 'info',
            message: '未找到动态表单json，只能自己写表格了',
          });
        }
      });
    },
    // 添加列
    addColumn(command) {
      switch (command) {
        // 普通列
        case 'addColumn':
          this.designedJSON.columns.push({
            prop: '',
            label: '',
            align: 'center',
            headerAlign: 'center',
            showOverflowTooltip: true,
            minWidth: this.minColumnWidth,
            sortable: 'custom',
            searchable: true,
          });
          break;
        // 普通列x10
        case 'addColumnx10':
          for (let i = 0; i < 10; i += 1) {
            this.designedJSON.columns.push({
              prop: '',
              label: '',
              align: 'center',
              headerAlign: 'center',
              showOverflowTooltip: true,
              minWidth: this.minColumnWidth,
              sortable: 'custom',
              searchable: true,
            });
          }
          break;
        // 操作列
        case 'addActionColumn':
          this.designedJSON.columns.push({
            prop: '',
            label: '操作',
            minWidth: 180,
            align: 'center',
            headerAlign: 'center',
            slotName: 'actionColumn',
            fixed: 'right',
            sortable: 'false',
            searchable: false,
          });
          break;
        default:
          break;
      }
    },
    // 自动设置
    autoSet(command) {
      switch (command) {
        // 自动设置检索状态
        case 'autoSetSearchable':
          this.designedJSON.columns = this.designedJSON.columns.map((item) => {
            item.searchable = item.slotName === '' || item.slotName == null;
            return item;
          });
          break;
        // 自动设置表头居中对齐
        case 'autoSetAlign':
          this.designedJSON.columns = this.designedJSON.columns.map((item) => {
            // 操作列
            if (
              (item.slotName !== '' && item.slotName != null)
              || ['年', '时间', '期'].some(c => item.label.includes(c))
            ) {
              // 列按钮居中
              item.align = 'center';
            } else if (
              (item.slotName !== '' && item.slotName != null)
              || ['万元', '得票数', '百分比', '人数', '数量'].some(c => item.label.includes(c))
            ) {
              item.align = 'right';
            } else {
              item.align = 'center';
            }
            // 表头居中
            item.headerAlign = 'center';
            return item;
          });
          break;
        // 根据表单设置表格高级搜索
        case 'autoSetSearchOption':
          this.autoSetSearchOption();
          break;
        // 根据表单生成表格
        case 'generateTableByForm':
          if (this.selectedForm == null) {
            this.$message({
              type: 'info',
              message: '请先选择表单',
            });
            break;
          }
          this.$PROCRUD.getFormDetail(this.selectedForm).then((res) => {
            if (res.data !== null) {
              const jsonObj = JSON.parse(res.data.formJson);
              // 遍历行
              for (const row of jsonObj.list) {
                // 遍历列
                for (const column of row.columns) {
                  const { model } = column.list[0];
                  this.designedJSON.columns.push({
                    prop: model.split('_')[1] || model.split('_')[0],
                    label: column.list[0].name,
                    minWidth: this.minColumnWidth,
                    align: 'center',
                    headerAlign: 'center',
                    showOverflowTooltip: true,
                    sortable:
                      column.list[0].sortable != null
                        ? column.list[0].sortable
                        : 'custom',
                    slotName: '',
                    searchable: true,
                  });
                }
              }
              // 默认添加操作列
              this.designedJSON.columns.push({
                prop: '',
                label: '操作',
                minWidth: 180,
                align: 'center',
                headerAlign: 'center',
                slotName: 'actionColumn',
                fixed: 'right',
                sortable: 'false',
                searchable: false,
              });
            } else {
              this.$message({
                type: 'info',
                message: '未找到动态表单json，只能自己写表格了',
              });
            }
          });
          this.autoSetSearchOption();
          break;
        default:
          break;
      }
    },
    // 删除列
    removeColumn(index) {
      this.designedJSON.columns.splice(index, 1);
    },
  },
  watch: {
    designedJSON(newValue) {
      this.$emit('update:designedJSON', newValue);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-container {
  margin-bottom: 20px;
  & > * {
    margin: 0 10px 0 0;
  }
}
.chk-container {
  margin: 0 -10px;
  .chkColumn {
    width: 120px;
    margin: 5px 10px !important;
  }
}
h2 {
  padding-bottom: 7px;
  border-bottom: 1px dashed #ededed;
  margin-bottom: 15px;
  font-size: 19px;
  font-weight: normal;
  span {
    font-size: 0.7em;
    color: #b6b6b6;
  }
}
</style>
