<!--
 * @file: 本地运行debug (umd打包后调试请允许demo.html)
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年10月30 15:58:48
-->
<template>
  <div id="app">
    <el-container>
      <el-header height="80px" class="top">
        <div class="logo">
          <img src="https://pic.downk.cc/item/5ff7d31d3ffa7d37b3c8ece9.png" />
          <h2>ElementProCrud</h2>
        </div>
        <div class="info">
          <span class="tips">解放双手 早点下班</span>
        </div>
        <div class="right">
          <el-link target="_blank" :underline="false" href="http://server.boboooooo.top:9999/admin/#/login" type="primary">
            <h3>生产环境示例</h3>
          </el-link>
          <el-link target="_blank" :underline="false" href="https://crud.boboooooo.top/" type="primary">
            <h3>文档</h3>
          </el-link>
          <el-link target="_blank" :underline="false" href="https://github.com/BoBoooooo/Element-Pro-Crud" type="primary">
            <img style="marign-top:10px" src="https://img.shields.io/github/stars/BoBoooooo/Element-Pro-Crud?style=social" />
          </el-link>
        </div>
      </el-header>
      <el-main class="content">
        <el-container class="container">
          <el-header>表格设计器(TableDesigner)</el-header>
          <el-main>
            <TableDesigner :dictList="dictList" :formList="formList" ref="tableDesigner"></TableDesigner>
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
          <el-header>CrudTable组件 此处为人员信息管理示例</el-header>
          <el-main>
            <div class="demo-actions">
              <el-form :inline="true" :model="visibleList">
                <el-switch v-model="visibleList.btnAdd" inactive-text="新增按钮"></el-switch>
                <el-switch v-model="visibleList.actionColumnBtnEdit" inactive-text="编辑按钮"></el-switch>
                <el-switch v-model="visibleList.actionColumnBtnDel" inactive-text="删除按钮"></el-switch>
                <el-switch v-model="visibleList.actionColumnBtnDetail" inactive-text="查看按钮"></el-switch>
                <el-switch v-model="visibleList.seniorSearchBtn" inactive-text="高级查询按钮"></el-switch>
                <el-divider direction="vertical"></el-divider>
                <el-switch v-model="visibleList.actionColumn" inactive-text="操作列"></el-switch>
                <el-switch v-model="visibleList.tableTitle" inactive-text="表格标题"></el-switch>
                <el-switch v-model="visibleList.searchForm" inactive-text="查询区域"></el-switch>
                <el-switch v-model="searchMode" inactive-text="平铺高级查询"></el-switch>
                <el-divider direction="vertical"></el-divider>
                <el-switch v-model="readOnly" inactive-text="只读模式"></el-switch>
              </el-form>
            </div>
            <CrudTable :searchMode="searchMode? 'cover':'popover'" tableTitle="人员管理" tableName="person" :readOnly="readOnly" :visibleList="visibleList" :isMultiple="false">
              <template #column_jobno="{row}">
                <el-tag>{{ row.jobno }}</el-tag>
              </template>
              <template #column_personname="{row}">
                <span><i class="el-icon el-icon-user" style="color: red"></i>{{ row.personname }}</span>
              </template>
              <template #btnCustom="{row}">
                <el-button size="mini" @click="getRowData(row)">自定义</el-button>
              </template>
            </CrudTable>
          </el-main>
        </el-container>
      </el-main>
      <el-footer> </el-footer>
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
    getRowData(row) {
      this.$alert(JSON.stringify(row));
    },
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
    crud(DML.SELECT, 'ad_codelist_type').then((res) => {
      this.dictList = res.data.list.map(item => ({
        label: item.typeName,
        value: item.codeValue,
      }));
    });
  },
  data() {
    return {
      dictList: [],
      formList: [],
      allTables: null,
      btnSaveIsLoading: false,
      readOnly: false,
      visibleList: {
        tableTitle: true,
        btnAdd: true,
        actionColumnBtnDel: true,
        actionColumnBtnEdit: true,
        actionColumnBtnDetail: true,
        searchForm: true,
        actionColumn: true,
        seniorSearchBtn: true,
      },
      searchMode: false,
    };
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}
h2,
h3 {
  margin: 0;
  display: inline-block;
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
.top {
  padding: 10px 8rem;
  background: #ddf4ff;
  text-align: center;
  .logo {
    float: left;
    display: flex;
    img {
      display: inline-block;
      width: 60px;
      height: 60px;
    }
    h2 {
      margin-left: 10px;
      color: #2196f3;
      text-shadow: 1px 1px rgb(189, 189, 189);
    }
  }
  .info {
    display: inline-block;
    .tips {
      font-size: 20px !important;
      font-weight: 600;
    }
  }
  .right {
    float: right;
    margin-top: 20px;
    line-height: 10px;
    & > * {
      margin-left: 10px;
    }
  }
}
.demo-actions {
  border: 1px solid #333;
  padding: 20px;
  ::v-deep {
    .el-switch {
      margin-right: 10px;
    }
    .el-form--inline {
      text-align: left;
    }
  }
}
.content {
  max-width: 1600px;
  margin: 0 auto;
}

.el-radio-group {
  padding-left: 10px !important;
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
