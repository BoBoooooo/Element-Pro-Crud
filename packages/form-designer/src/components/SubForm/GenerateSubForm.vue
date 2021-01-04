<!--
 * @file: 子表单
 * GenerateFormItem如果想拿到整个子表单所有行数据改写如下
 * v-model="subTableForm.tableData[scope.$index][row.model]"
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020-12-03 20:47:28
-->
<template>
  <div class="table_box">
    <!-- 如果不想展示错误提示信息,可以加上show-message参数 -->
    <el-form  :model="subTableForm" ref="tableForm" :rules="subTableForm.rules" :show-message="false">
      <el-table :data="subTableForm.tableData" border style="width: 100%" fit>
        <el-table-column type="index" align="center" label="#" header-align="center" width="50"> </el-table-column>
        <el-table-column v-for="(row, index) in widget.tableColumns" :key="index" :prop="row.model" :label="row.name">
          <template slot-scope="scope">
            <!-- prop的规则: 在普通的form表单中是一个对象,prop是对象的属性. 表格是由多个对象组成的数组,在写prop是需要根据索引给值.这里的tableData就相当于对象的属性 !-->
            <!-- rules也要单独给 -->
            <template v-if="readOnly || scope.row._mode === 'DETAIL'">
              <span>{{scope.row[row.model]}}</span>
            </template>
              <GenerateFormItem
              v-else
              :remote="remote"
              :model="scope.row[row.model]"
              v-model="inlineFormData[row.model]"
              :widget="row"
              :rules="row.rules"
              :readOnly="readOnly || row._mode === 'DETAIL' ? {} : null"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" :width="100">
          <template slot="header">
            <span class="add-button"><i type="primary" size="mini" class="el-icon el-icon-plus" @click="addRow" v-if="!readOnly"></i>添加</span>
          </template>
          <template slot-scope="scope" v-if="!readOnly">
            <el-button class="action-btn" @click="handleEditOnClick(scope.row)" type="primary" size="mini" v-if="!isEditable(scope.row)">编辑</el-button>
            <el-button class="action-btn" :btnSaveIsLoading="btnSaveIsLoading" @click="handleSaveOnClick(scope.row)" type="success" size="mini" v-if="isEditable(scope.row)">保存</el-button>
            <el-button class="action-btn" @click="handleDeleteOnClick(scope.row)" type="danger" size="mini" v-if="!isEditable(scope.row) && scope.row.id">删除</el-button>
            <el-button class="action-btn" @click="handleCancelOnClick(scope.row, scope.$index)" type="normal" size="mini" v-if="isEditable(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DML } from '@/types/common';

@Component({
  name: 'GenerateSubForm',
  components: {
    GenerateFormItem: () => import('../../GenerateFormItem.vue'),
  },
})
export default class GenerateSubForm extends Vue {
  $refs!: {
    tableForm: HTMLFormElement;
  };

  @Prop({
    type: Object as () => {
      tableColumns: any;
      options: any;
    },
    default: () => ({}),
  })
  widget!: {
    tableColumns: any;
    options: any;
  };

  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote: any;

  @Prop({
    type: Object,
    default: null,
  })
  readOnly: any;

  // 整个子表单数据
  subTableForm = {
    tableData: [],
  };

  // 单行数据
  inlineFormData = {};

  mode: 'ADD' | 'EDIT' | 'DETAIL' | '' = 'DETAIL';

  btnSaveIsLoading = false;

  models: any = {}

  created() {
    this.fetchList();
  }

  fetchList() {
    if (this.widget.options.tableName) {
      this.$PROCRUD.crud(DML.SELECT, this.widget.options.tableName).then((res) => {
        if (res.data.list.length === 0) {
          this.addRow();
        } else {
          this.subTableForm.tableData = res.data.list.map(item => ({
            ...item,
            _mode: 'DETAIL',
          }));
        }
      });
    } else {
      this.addRow();
    }
  }

  // 是否可编辑
  isEditable(row) {
    return row._mode && row._mode !== 'DETAIL';
  }

  // 添加一行
  addRow() {
    if (this.mode !== 'DETAIL') {
      this.$message.warning('请先保存当前数据');
      return;
    }
    this.mode = 'ADD';
    this.inlineFormData = {};
    const [obj] = this.widget.tableColumns.map(item => ({
      [item.model]: item.options.defaultValue || '',
      _mode: 'ADD',
    }));
    console.log(obj);
    (this.subTableForm.tableData as any).push(obj);
  }

  handleDeleteOnClick(row) {
    this.$confirm('确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        const promise = this.$PROCRUD.crud(DML.DELETE, this.widget.options.tableName, {}, { id: row.id });
        promise.then(() => {
          this.remote[this.widget.options.remoteFunc]((data) => {
            if (Array.isArray(data)) {
              if (data.length === 0) {
                this.addRow();
              } else {
                (this.subTableForm.tableData as any) = data;
              }
            }
          });
          this.$message({
            type: 'success',
            message: '删除成功',
          });
        });
      })
      .catch(() => {
        this.$message.info('已取消删除');
      });
  }

  handleCancelOnClick(row, index) {
    if (row._mode === 'ADD') {
      this.subTableForm.tableData.splice(index, 1);
    }
    row._mode = 'DETAIL';
    this.mode = 'DETAIL';
  }

  // 编辑当前行数据
  handleEditOnClick(row) {
    if (this.mode !== 'DETAIL') {
      this.$message.warning('请先保存当前数据');
      return;
    }
    row._mode = 'EDIT';
    this.mode = 'EDIT';
    this.inlineFormData = row;
  }

  // 保存按钮点击
  handleSaveOnClick() {
    this.btnSaveIsLoading = true;
    // 调用此方法验证表单数据和获取表单数据
    this.$refs.tableForm.validate((valid) => {
      if (valid) {
        let type;
        let msg;
        const formValue = this.inlineFormData as any;
        // 如果select,radio,checkbox等多选情况返回数组的话，默认拼接成逗号分隔的字符串传给后台
        Object.keys(formValue).forEach((k) => {
          if (Array.isArray(formValue[k])) {
            formValue[k] = formValue[k].toString();
          }
        });
        // 根据对话框状态判断保存或编辑
        if (formValue._mode === 'ADD') {
          type = DML.INSERT;
          msg = '添加成功';
        } else {
          type = DML.UPDATE;
          msg = '编辑成功';
        }
        delete formValue._mode;
        const promise = this.$PROCRUD.crud(type, this.widget.options.tableName, formValue);
        promise
          .then((res: any) => {
            if (res.code !== 200) {
              this.$message({
                type: 'error',
                message: `保存失败，原因：${res.message}`,
              });
              this.btnSaveIsLoading = false;
              return;
            }
            this.btnSaveIsLoading = false;
            this.$message({
              type: 'success',
              message: msg,
            });
            formValue._mode = 'DETAIL';
            this.mode = 'DETAIL';
            this.fetchList();
          })
          .catch(() => {
            this.btnSaveIsLoading = false;
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.action-btn {
  height: 22px;
  width: 34px;
  padding: 0;
}
.el-icon-plus{
  color: rgb(85, 85, 85);
}
.add-button{
  cursor: pointer;
}
</style>
