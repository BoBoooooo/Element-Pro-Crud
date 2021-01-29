<!--
 * @file: 本地运行debug (umd打包后调试请允许demo.html)
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年10月30 15:58:48
-->
<template>
  <div id="app">
    <el-container>
      <el-header height="80px"
                 class="top">
        <div class="logo">
          <img src="https://pic.downk.cc/item/5ff7d31d3ffa7d37b3c8ece9.png" />
          <h2>ElementProCrud</h2>
        </div>
        <div class="info">
          <span class="tips">解放双手 早点下班</span>
        </div>
        <div class="right">
          <el-link target="_blank"
                   :underline="false"
                   href="http://server.boboooooo.top:9998/"
                   type="primary">
            <h3>生产环境示例</h3>
          </el-link>
          <el-link target="_blank"
                   :underline="false"
                   href="https://crud.boboooooo.top/"
                   type="primary">
            <h3>文档</h3>
          </el-link>
          <el-link target="_blank"
                   :underline="false"
                   href="https://github.com/BoBoooooo/Element-Pro-Crud"
                   type="primary">
            <img style="marign-top:10px"
                 src="https://img.shields.io/github/stars/BoBoooooo/Element-Pro-Crud?style=social" />
          </el-link>
        </div>
      </el-header>

      <el-main class="content">
        <el-container class="container">
          <el-header><el-tag>表格设计器(TableDesigner)</el-tag></el-header>
          <el-main>
            <TableDesigner :dictList="dictList"
                           :formList="formList"
                           ref="tableDesigner"></TableDesigner>
          </el-main>
        </el-container>

        <el-container class="container">
          <el-header><el-tag>表单设计器(FormDesigner)</el-tag></el-header>
          <el-main>
            <FormDesigner ref="formDesigner"
                          :getFormKey="getTableFields">
              <template #custom-btn>
                <el-button disabled
                           type="normal"
                           size="small"
                           @click="btnSaveOnClick"
                           :loading="btnSaveIsLoading">保存</el-button>
              </template>
            </FormDesigner>
          </el-main>
        </el-container>
          <el-container class="container">
          <el-header><el-tag>ProTable组件</el-tag> (基于El-Table二次封装,托管分页，查询，表格。仅包含数据表格及搜索功能，增删改查封装见CrudTable)
            <el-button  @click="handleGenerateJson" icon="el-icon-tickets" type="warning" size="small">
              当前表格json
            </el-button>
          </el-header>
          <el-main class="demo-actions">
            <el-row :gutter="10">
              <el-col :span="4"
                      class="left-container">
                <div class="form-container">
                  <h4>表格相关配置</h4>
                  <el-form :inline="true"
                           size="mini"
                           :model="visibleList">
                    <el-switch v-model="visibleList.border"
                               inactive-text="边框"></el-switch>
                    <el-switch v-model="visibleList.stripe"
                               inactive-text="斑马纹"></el-switch>
                    <el-switch v-model="showPagination"
                               inactive-text="分页"></el-switch>
                    <el-switch v-model="showHeader"
                               inactive-text="表头"></el-switch>
                    <el-switch v-model="isMultiple"
                               inactive-text="多选"></el-switch>
                    <el-switch v-model="showColumnIndex"
                               inactive-text="序号列"></el-switch>
                    <!-- <el-switch v-model="visibleList.actionColumn"
                               inactive-text="操作列"></el-switch> -->
                    <el-divider>表格尺寸</el-divider>
                    <el-radio-group v-model="size" size="mini">
                      <el-radio label="medium">中等</el-radio>
                      <el-radio label="small">较小</el-radio>
                      <el-radio label="mini">迷你</el-radio>
                    </el-radio-group>
                  </el-form>
                </div>
                <el-divider></el-divider>
                <div class="form-container">
                  <h4>工具栏</h4>
                  <el-form :inline="true"
                           size="mini"
                           :model="visibleList">
                    <el-switch v-model="visibleList.tableTitle"
                               inactive-text="表格标题"></el-switch>
                    <el-switch v-model="visibleList.searchForm"
                               inactive-text="查询区域"></el-switch>
                    <el-switch v-model="visibleList.seniorSearchBtn"
                               inactive-text="高级查询"></el-switch>
                  </el-form>
                </div>
                <el-divider></el-divider>
                <div class="form-container">
                  <h4>查询表单</h4>
                  <el-form :inline="true"
                           size="mini"
                           :model="visibleList">
                    <el-switch v-model="searchMode"
                               inactive-text="平铺高级查询"></el-switch>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="20">
                <PersonProTable :searchMode="searchMode? 'cover':'popover'"
                           tableTitle="人员管理"
                           :size="size"
                           :columns="columns"
                           :readOnly="readOnly"
                           :show-header="showHeader"
                           :showPagination="showPagination"
                           :border="visibleList.border"
                           :stripe="visibleList.stripe"
                           :showColumnIndex="showColumnIndex"
                           :isMultiple="isMultiple"
                           :visibleList="visibleList">
                </PersonProTable>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
        <el-container class="container">
          <el-header><el-tag>CrudTable</el-tag> 基于ProTable + GenerateForm + El-Dialog 二次封装 （有批量操作按钮时会默认开启多选模式）
            <el-button  @click="handleGenerateJson" icon="el-icon-tickets" type="warning" size="small">
              当前表格json
            </el-button>
          </el-header>
          <el-main class="demo-actions">
            <el-row :gutter="10">
              <el-col :span="4"
                      class="left-container">
                <div class="form-container">
                  <h4>表格相关配置</h4>
                  <el-form :inline="true"
                           size="mini"
                           :model="visibleList">
                    <el-switch v-model="readOnly"
                               inactive-text="只读模式"></el-switch>
                    <el-switch v-model="visibleList.border"
                               inactive-text="边框"></el-switch>
                    <el-switch v-model="visibleList.stripe"
                               inactive-text="斑马纹"></el-switch>
                    <el-switch v-model="showPagination"
                               inactive-text="分页"></el-switch>
                    <el-switch v-model="showHeader"
                               inactive-text="表头"></el-switch>
                    <el-switch v-model="isMultiple"
                               inactive-text="多选"></el-switch>
                    <el-switch v-model="showColumnIndex"
                               inactive-text="序号列"></el-switch>
                    <!-- <el-switch v-model="visibleList.actionColumn"
                               inactive-text="操作列"></el-switch> -->
                    <el-divider>操作按钮</el-divider>
                      <el-switch v-model="visibleList.btnAddOnColumnHeader"
                               inactive-text="列头新增按钮(需重载)"></el-switch>
                    <el-switch v-model="visibleList.actionColumnBtnEdit"
                               inactive-text="编辑按钮"></el-switch>
                    <el-switch v-model="visibleList.actionColumnBtnDel"
                               inactive-text="删除按钮"></el-switch>
                    <el-switch v-model="visibleList.actionColumnBtnDetail"
                               inactive-text="查看按钮"></el-switch>
                    <el-divider>表格尺寸</el-divider>
                    <el-radio-group v-model="size" size="mini">
                      <el-radio label="medium">中等</el-radio>
                      <el-radio label="small">较小</el-radio>
                      <el-radio label="mini">迷你</el-radio>
                    </el-radio-group>
                  </el-form>
                </div>
                <el-divider></el-divider>
                <div class="form-container">
                  <h4>工具栏</h4>
                  <el-form :inline="true"
                           size="mini"
                           :model="visibleList">
                    <el-switch v-model="visibleList.tableTitle"
                               inactive-text="表格标题"></el-switch>
                    <el-switch v-model="visibleList.btnAdd"
                               inactive-text="新增按钮"></el-switch>
                    <el-switch v-model="visibleList.searchForm"
                               inactive-text="查询区域"></el-switch>
                    <el-switch v-model="visibleList.seniorSearchBtn"
                               inactive-text="高级查询按钮"></el-switch>
                    <el-switch v-model="visibleList.btnDel"
                               inactive-text="批量删除"></el-switch>
                  </el-form>
                </div>
                <el-divider></el-divider>
                <div class="form-container">
                  <h4>查询表单</h4>
                  <el-form :inline="true"
                           size="mini"
                           :model="visibleList">
                    <el-switch v-model="searchMode"
                               inactive-text="平铺高级查询"></el-switch>
                  </el-form>
                </div>
                <el-divider></el-divider>
                <div class="form-container">
                  <h4>操作按钮名称</h4>
                  <el-form :inline="true"
                           size="mini"
                           :model="textMap">
                    <el-form-item label="新增按钮">
                      <el-input v-model="textMap.add"></el-input>
                    </el-form-item>
                    <el-form-item label="编辑按钮">
                      <el-input v-model="textMap.edit"></el-input>
                    </el-form-item>
                    <el-form-item label="删除按钮">
                      <el-input v-model="textMap.del"></el-input>
                    </el-form-item>
                    <el-form-item label="查看按钮">
                      <el-input v-model="textMap.detail"></el-input>
                    </el-form-item>
                    <el-form-item label="批量删除按钮">
                      <el-input v-model="textMap.multiDel"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="20">
                <PersonCrudTable :searchMode="searchMode? 'cover':'popover'"
                           tableTitle="人员管理"
                           tableName="person"
                           :size="size"
                           :textMap="textMap"
                           :columns="columns"
                           :readOnly="readOnly"
                           :show-header="showHeader"
                           :showPagination="showPagination"
                           :border="visibleList.border"
                           :stripe="visibleList.stripe"
                           :showColumnIndex="showColumnIndex"
                           :isMultiple="isMultiple"
                           :visibleList="visibleList">
                  <template #column_jobno="{row}">
                    <el-tag>{{ row.jobno }}</el-tag>
                  </template>
                  <template #column_personname="{row}">
                    <span><i class="el-icon el-icon-user"
                         style="color: red"></i>{{ row.personname }}</span>
                  </template>
                  <template #btnCustom="{row}">
                    <el-button size="mini"
                               @click="getRowData(row)">自定义</el-button>
                  </template>
                </PersonCrudTable>
              </el-col>
            </el-row>
          </el-main>
        </el-container>

           <el-container class="container">
          <el-header>
            <el-tag>GenerateForm渲染图表示例</el-tag>
            <el-button  @click="handleGenerateJson('chart')" icon="el-icon-tickets" type="warning" size="small">
              当前表单JSON
            </el-button>
          </el-header>
          <el-main class="demo-actions">
            <el-row :gutter="10">
              <el-col :span="24">
                <ChartScreen></ChartScreen>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-main>
      <el-footer height="80px"
                 class="footer">
        Made with <span class="heart">❤</span> BoBo
      </el-footer>
    </el-container>
     <CusDialog :visible="jsonVisible" @on-close="jsonVisible = false" ref="jsonPreview" width="800px" form>
      <div id="jsoneditor" style="height: 400px;width: 100%;">{{ jsonTemplate }}</div>
    </CusDialog>
  </div>
</template>

<script>
import { DML, crud } from '@/demo/api/crud';
import {
  getTables, getFormKey, getTableDetail, getFormDetail,
} from '@/demo/api/plugin';
import CusDialog from '@/component/common/CusDialog.vue';
import PersonCrudTable from './component/PersonCrudTable.vue';
import PersonProTable from './component/PersonProTable.vue';
import ChartScreen from './component/ChartScreen.vue';
import chartData from './component/data';

export default {
  name: 'app',
  methods: {
    getRowData(row) {
      this.$alert(JSON.stringify(row));
    },
    handleGenerateJson(type) {
      this.jsonVisible = true;
      if (type === 'chart') {
        this.jsonTemplate = JSON.stringify(this.chartData, null, 2);
      } else {
        this.jsonTemplate = JSON.stringify(this.columns, null, 2);
      }

      this.$nextTick(() => {
        const editor = ace.edit('jsoneditor');
        editor.session.setMode('ace/mode/json');
      });
    },
    getTableFields(tablename) {
      return getFormKey(tablename);
    },
    // 保存设计
    btnSaveOnClick() {
      const formValues = this.$refs.formDesigner.getData();
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
        this.columns = JSON.parse(this.tableJSON.formJson);
      });
    });
    crud(DML.SELECT, 'form').then((res) => {
      this.formList = res.data.list;
    });
    this.initFormJson();
    crud(DML.SELECT, 'ad_codelist_type').then((res) => {
      this.dictList = res.data.list.map(item => ({
        label: item.typeName,
        value: item.id,
      }));
    });
  },
  data() {
    return {
      chartData,
      jsonVisible: false,
      jsonTemplate: '',
      dictList: [],
      formList: [],
      columns: {},
      allTables: null,
      btnSaveIsLoading: false,
      readOnly: false,
      textMap: {
        add: '添加',
        edit: '编辑',
        del: '删除',
        detail: '查看',
        multiDel: '批量删除',
      },
      visibleList: {
        tableTitle: true,
        btnAdd: true,
        btnDel: true,
        btnAddOnColumnHeader: false,
        actionColumnBtnDel: true,
        actionColumnBtnEdit: true,
        actionColumnBtnDetail: false,
        searchForm: true,
        actionColumn: true,
        seniorSearchBtn: true,
        border: false,
        stripe: false,
      },
      showPagination: true,
      isMultiple: true,
      searchMode: false,
      showHeader: true,
      showColumnIndex: false,
      size: '',
    };
  },
  components: {
    CusDialog,
    PersonCrudTable,
    PersonProTable,
    ChartScreen,
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  background: #f2f2f2;
}
h2,
h3 {
  margin: 0;
  display: inline-block;
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
  border: 1px solid rgb(92, 92, 92);
  margin: 2rem 0;
  background: white;
}
.el-header {
  color: #333;
  line-height: 60px;
  background: white;
}
.top {
  padding: 10px 8rem;
  text-align: center;
  box-shadow: 0 6px 12px #ededed;
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

.content {
  max-width: 1600px;
  margin: 0 auto;
  .el-header {
    background: #97c8ff;
  }
  .demo-actions {
    text-align: left;
    padding: 20px;
    ::v-deep {
      .el-switch {
        margin-right: 10px;
      }
      .el-form--inline {
        text-align: left;
      }
    }
    .left-container {
      border-right: 1px solid #eee;
      max-height: 1000px;
      overflow: auto;
      .form-container {
        padding: 5px 10px;
        border-radius: 10px;
        border: 1px solid #e8f2f9 ;
        background: #f3faff;
      }
    }
  }
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
.footer {
  position: relative;
  z-index: 100;
  clear: both;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  line-height: 80px;
  color: hsla(0, 0%, 100%, 0.65);
  font-size: 14px;
  background-color: #000;
  text-align: center;
  .heart {
    color: #f73f51;
    font-size: 22px;
  }
}
</style>
