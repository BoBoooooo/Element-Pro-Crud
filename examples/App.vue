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
    <CrudTable tableName='dept'
               :visibleList='{
           tableTitle:false,
         }'
               fullHeight>
    </CrudTable>
    <el-button @click="showDialog('form')"
               type="primary">打开表单设计器</el-button>
    <el-button @click="showDialog('table')"
               type="danger">打开表格设计器</el-button>
  </div>
</template>

<script>
export default {
  name: "app",
  methods: {
    showDialog(name) {
      this.$refs[name].showDialog();
    },
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
