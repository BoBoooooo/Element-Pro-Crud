<!--
 * @file: 本地运行debug (umd打包后调试请允许demo.html)
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年10月30 15:58:48
-->
<template>
  <div id="app">
    <TableDesignerDialog ref="table"></TableDesignerDialog>
    <FormDesignerDialog ref="form"></FormDesignerDialog>
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
    <el-button @click="showDialog('form')" type="primary"
      >打开表单设计器</el-button
    >
    <el-button @click="showDialog('table')" type="danger"
      >打开表格设计器</el-button
    >
  </div>
</template>

<script>
import { DML, crud } from '@/api/public/crud';

export default {
  name: 'app',
  methods: {
    showDialog(name) {
      this.$refs[name].showDialog();
    },
  },
  data() {
    return {

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
  color: #2c3e50;
  height: 100%;
}
</style>
