<!--
 * @file: 本地运行debug (umd打包后调试请允许demo.html)
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年10月30 15:58:48
-->
<template>
  <div id="app">
    <el-container class="container">
      <el-header>表格设计器(TableDesigner)</el-header>
      <el-main>
        <TableDesigner :formList="formList"  ref="tableDesigner"></TableDesigner>
      </el-main>
    </el-container>

    <el-container class="container">
      <el-header>表单设计器(FormDesigner)</el-header>
      <el-main>
        <FormDesigner ref="formDesigner" :getFormKey="getTableFields">
          <template #custom-btn>
            <el-button disabled type="text" size="small" @click="btnSaveOnClick" :loading="btnSaveIsLoading">保存</el-button>
          </template>
        </FormDesigner>
      </el-main>
    </el-container>
    <el-container class="container">
      <el-header>CrudTable</el-header>
      <el-main>
        <CrudTable tableName="person" :isMultiple="false"> </CrudTable>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { DML, crud } from '@/demo/api/crud';
import {
  getTables, getFormKey, getTableDetail, getFormDetail,
} from '@/demo/api/plugin';

export default {
  name: 'app',
  methods: {
    getTableFields(tablename) {
      return getFormKey(tablename);
    },
    // 保存设计
    btnSaveOnClick() {
      const formValues = this.$refs.formDesigner.getData();
      console.log(formValues);
    },
    initFormJson() {
      getFormDetail('person').then((res) => {
        this.$nextTick(() => {
          this.$refs.formDesigner.setJSON(JSON.parse(res.data.formJson));
        });
      });
    },
  },
  created() {
    getTables().then((res) => {
      this.allTables = res.data.map(item => ({
        label: item.TABLE_NAME,
        value: item.TABLE_NAME,
      }));
    });
    getTableDetail('person').then((res) => {
      this.tableJSON = res.data;
      this.$nextTick(() => {
        this.$refs.tableDesigner.setJSON(JSON.parse(this.tableJSON.formJson));
      });
    });
    crud(DML.SELECT, 'form').then((res) => {
      this.formList = res.data.list;
    });
    this.initFormJson();
  },
  data() {
    return {
      formList: [],
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.el-aside {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  padding-top: 20px;
}
.container {
  border: 1px solid rgb(186, 186, 186);
  margin: 2rem 0;
}
.el-header {
  background: #87c1fa;
  color: #333;
  line-height: 60px;
}

.el-radio-group {
  padding-left: 10px;
}

.dialog {
  ::v-deep {
    .el-dialog__body {
      height: 100%;
      padding: 0;
    }
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__headerbtn {
      top: 13px;
      right: 10px;
      border: 1px solid gray;
      background: #fffbd7;
      color: black;
      z-index: 100;
    }
  }
}
</style>
