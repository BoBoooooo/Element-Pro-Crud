<!--
 * @file: 本地运行debug (umd打包后调试请允许demo.html)
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年10月30 15:58:48
-->
<template>
  <div id="app">
    <TableDesigner :allTables="allTables" ref="table"></TableDesigner>

    <CrudTable
      tableName="users"
      orderCondition="timestamp desc"
      :visibleList="{
        tableTitle: false,
      }"
      :actionColumnWidth="300"
      :remoteFuncs="remoteFuncs"
      fullHeight
    >
    </CrudTable>
    <el-button @click="visible = true" type="primary"
      >打开表单设计器</el-button
    >
    <el-button @click="showDialog('table')" type="danger"
      >打开表格设计器</el-button
    >


     <el-dialog v-if="visible" ref="dialog" fullscreen class="dialog" :visible.sync="visible" append-to-body>
      <FormDesigner ref="formDesigner" :allTables="allTables" :getTableFields="getTableFields">
        <template #custom-btn>
          <el-button type="text" size="small" @click="btnSaveOnClick" :loading="btnSaveIsLoading">保存</el-button>
        </template>
      </FormDesigner>
    </el-dialog>

  </div>
</template>

<script>
import { DML, crud } from '@/demo/api/crud';
import { getTables, getFormKey } from '@/demo/api/plugin';

export default {
  name: 'app',
  methods: {
    showDialog(name) {
      this.$refs[name].showDialog();
    },
    getTableFields() {
      return getFormKey;
    },
    // 保存设计
    btnSaveOnClick() {
      const formValues = this.$refs.formDesigner.getData();
      console.log(formValues);
    },
  },
  created() {
    getTables().then((res) => {
      this.allTables = res.data.map(item => ({
        label: item.TABLE_NAME,
        value: item.TABLE_NAME,
      }));
    });
  },
  data() {
    return {
      visible: false,
      remoteFuncs: {
        // 请求角色
        funcGetRole(resolve) {
          crud(DML.SELECT, 'role').then((res) => {
            const options = res.data.list.map(item => ({
              label: item.roleName,
              value: item.id,
            }));
            resolve(options);
          });
        },
        // 请求部门tree
        funcGetDeptTree: (resolve) => {
          // 此处暂时写死 admin权限的账号可以看到全部部门
          crud(DML.TREE, 'dept').then((res) => {
            resolve(res.data);
          });
        },
      },
      allTables: null,
      btnSaveIsLoading: false,

    };
  },
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: auto;
  color: #2c3e50;
  height: 100%;
}
</style>
