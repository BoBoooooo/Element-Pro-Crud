<!--
 * @file: 本地运行debug (umd打包后调试请允许demo.html)
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年10月30 15:58:48
-->
<template>
  <div>
    <el-container class="page-container">
      <!-- 顶部导航 start -->
      <el-header height="64px" class="top">
        <div class="logo">
          <img src="https://pic.downk.cc/item/5ff7d31d3ffa7d37b3c8ece9.png" />
          <h2>ElementProCrud</h2>
        </div>
        <div class="info">
          <span class="tips">解放双手 早点下班</span>
        </div>
        <div class="right">
          <el-link target="_blank" :underline="false" href="http://server.boboooooo.top:9998/" type="primary">
            <h3>生产环境示例</h3>
          </el-link>
          <el-link target="_blank" :underline="false" href="http://procrud.fun/" type="primary">
            <h3>文档</h3>
          </el-link>

          <router-link to="/form" tag="a"><h3>表单设计器</h3></router-link>

          <el-link target="_blank" :underline="false" href="https://github.com/BoBoooooo/Element-Pro-Crud" type="primary">
            <img style="marign-top: 10px" src="https://img.shields.io/github/stars/BoBoooooo/Element-Pro-Crud?style=social" />
          </el-link>
        </div>
      </el-header>
      <!-- 顶部导航 end -->
      <!-- demo区域 start -->
      <el-main class="content">
        <el-container class="container">
          <el-header><el-tag effect="plain" type="info">表格设计器(TableDesigner)</el-tag></el-header>
          <el-main style="padding: 10px">
            <TableDesigner :dictList="dictList" :formList="formList" ref="tableDesigner"></TableDesigner>
          </el-main>
        </el-container>

        <el-container class="container">
          <el-header><el-tag effect="plain" type="info">表单设计器(FormDesigner)</el-tag></el-header>
          <el-main>
            <FormDesigner ref="formDesigner" :dictType="dictType" :getFormKey="getTableFields"> </FormDesigner>
          </el-main>
        </el-container>
        <el-container class="container">
          <el-header
            ><el-tag effect="plain" type="info">ProTable</el-tag> (基于El-Table二次封装,托管分页，查询，表格。仅包含数据表格及搜索功能，增删改查封装见CrudTable)
            <el-button @click="handleGenerateJson('ProTable')" icon="el-icon-tickets" type="primary" class="json-btn" size="small"> 当前表格json </el-button>
          </el-header>
          <el-main class="demo-actions">
            <el-row :gutter="10">
              <el-col :span="4" class="left-container">
                <div class="form-container">
                  <h4>表格相关配置</h4>
                  <el-form :inline="true" size="mini" :model="visibleList">
                    <el-switch v-model="visibleList.border" inactive-text="边框"></el-switch>
                    <el-switch v-model="visibleList.stripe" inactive-text="斑马纹"></el-switch>
                    <el-switch v-model="showPagination" inactive-text="分页"></el-switch>
                    <el-switch v-model="showHeader" inactive-text="表头"></el-switch>
                    <el-switch v-model="isMultiple" inactive-text="多选"></el-switch>
                    <el-switch v-model="showColumnIndex" inactive-text="序号列"></el-switch>
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
                  <el-form :inline="true" size="mini" :model="visibleList">
                    <el-switch v-model="visibleList.tableTitle" inactive-text="表格标题"></el-switch>
                    <el-switch v-model="visibleList.searchForm" inactive-text="查询区域"></el-switch>
                    <el-switch v-model="visibleList.seniorSearchBtn" inactive-text="高级查询"></el-switch>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="20">
                <PersonProTable
                  tableTitle="员工管理(多级表头示例)"
                  :size="size"
                  :columns="columns"
                  :readOnly="readOnly"
                  :show-header="showHeader"
                  :showPagination="showPagination"
                  :border="visibleList.border"
                  :stripe="visibleList.stripe"
                  :showColumnIndex="showColumnIndex"
                  :isMultiple="isMultiple"
                  :visibleList="visibleList"
                >
                </PersonProTable>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
        <el-container class="container">
          <el-header
            ><el-tag effect="plain" type="info">CrudTable</el-tag> 基于ProTable + GenerateForm + El-Dialog 二次封装 （有批量操作按钮时会默认开启多选模式）
            <el-button @click="handleGenerateJson" icon="el-icon-tickets" type="primary" class="json-btn" size="small"> 当前表格json </el-button>
          </el-header>
          <el-main class="demo-actions">
            <el-row :gutter="10">
              <el-col :span="4" class="left-container">
                <div class="form-container">
                  <h4>表格相关配置</h4>
                  <el-form :inline="true" size="mini" :model="visibleList">
                    <el-switch v-model="readOnly" inactive-text="只读模式"></el-switch>
                    <el-switch v-model="visibleList.border" inactive-text="边框"></el-switch>
                    <el-switch v-model="visibleList.stripe" inactive-text="斑马纹"></el-switch>
                    <el-switch v-model="showPagination" inactive-text="分页"></el-switch>
                    <el-switch v-model="showHeader" inactive-text="表头"></el-switch>
                    <el-switch v-model="isMultiple" inactive-text="多选"></el-switch>
                    <el-switch v-model="showColumnIndex" inactive-text="序号列"></el-switch>
                    <!-- <el-switch v-model="visibleList.actionColumn"
                               inactive-text="操作列"></el-switch> -->
                    <el-divider>操作按钮</el-divider>
                    <el-switch v-model="visibleList.btnAddOnColumnHeader" inactive-text="列头新增按钮(需重载)"></el-switch>
                    <el-switch v-model="visibleList.actionColumnBtnEdit" inactive-text="编辑按钮"></el-switch>
                    <el-switch v-model="visibleList.actionColumnBtnDel" inactive-text="删除按钮"></el-switch>
                    <el-switch v-model="visibleList.actionColumnBtnDetail" inactive-text="查看按钮"></el-switch>
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
                  <el-form :inline="true" size="mini" :model="visibleList">
                    <el-switch v-model="visibleList.tableTitle" inactive-text="表格标题"></el-switch>
                    <el-switch v-model="visibleList.btnAdd" inactive-text="新增按钮"></el-switch>
                    <el-switch v-model="visibleList.searchForm" inactive-text="查询区域"></el-switch>
                    <el-switch v-model="visibleList.seniorSearchBtn" inactive-text="高级查询按钮"></el-switch>
                    <el-switch v-model="visibleList.btnDel" inactive-text="批量删除"></el-switch>
                  </el-form>
                </div>
                <el-divider></el-divider>
                <div class="form-container">
                  <h4>操作按钮名称</h4>
                  <el-form :inline="true" size="mini" :model="textMap">
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
                <PersonCrudTable
                  tableTitle="人员管理"
                  tableName="person"
                  :size="size"
                  :textMap="textMap"
                  :readOnly="readOnly"
                  :show-header="showHeader"
                  :showPagination="showPagination"
                  :border="visibleList.border"
                  :stripe="visibleList.stripe"
                  :showColumnIndex="showColumnIndex"
                  :isMultiple="isMultiple"
                  :visibleList="visibleList"
                >
                </PersonCrudTable>
              </el-col>
            </el-row>
          </el-main>
        </el-container>

        <el-container class="container">
          <el-header>
            <el-tag effect="plain" type="info">GenerateForm渲染图表示例</el-tag>
            <el-button @click="handleGenerateJson('chart')" icon="el-icon-tickets" class="json-btn" type="primary" size="small"> 当前表单JSON </el-button>
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
      <!-- demo区域 end -->
      <el-footer height="80px" class="footer"> Made with <span class="heart">❤</span> BoBo </el-footer>
    </el-container>
    <!-- json预览Dialog start -->
    <CusDialog :visible="jsonVisible" @on-close="jsonVisible = false" ref="jsonPreview" width="800px" form>
      <div id="jsoneditor" style="height: 400px; width: 100%">{{ jsonTemplate }}</div>
    </CusDialog>
    <!-- json预览Dialog end -->
    <!-- 侧边滚动导航区域 start -->
    <ul class="navs">
      <li :class="{ active: active === 0 }" @click="scrollTo(0)">表格设计器</li>
      <li :class="{ active: active === 1 }" @click="scrollTo(1)">表单设计器</li>
      <li :class="{ active: active === 2 }" @click="scrollTo(2)">ProTable</li>
      <li :class="{ active: active === 3 }" @click="scrollTo(3)">CrudTable</li>
      <li :class="{ active: active === 4 }" @click="scrollTo(4)">图表示例</li>
    </ul>
    <!-- 侧边滚动导航区域 end -->
  </div>
</template>

<script>
import { DML, crud } from '@/demo/api/crud';
import { getTables, getFormKey, getTableDetail, getFormDetail } from '@/demo/api/plugin';
import CusDialog from '@/component/common/CusDialog.vue';

import { PersonCrudTable, PersonProTable, ChartScreen, chartData } from '@/demo/component';
import { proTableJson } from './data';

export default {
  name: 'Dashboard',
  components: {
    CusDialog,
    PersonCrudTable,
    PersonProTable,
    ChartScreen,
  },
  data() {
    return {
      active: 0, // 当前激活的导航索引
      chartData,
      jsonVisible: false,
      jsonTemplate: '',
      dictList: [],
      formList: [],
      dictType: [],
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
      showHeader: true,
      showColumnIndex: false,
      size: '',
    };
  },

  created() {
    crud(DML.SELECT, 'ad_codelist_type').then((res) => {
      this.dictType = res.data.list.map((item) => ({
        label: item.typeName,
        value: item.id,
      }));
    });
    getTables().then((res) => {
      this.allTables = res.data.map((item) => ({
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
      this.dictList = res.data.list.map((item) => ({
        label: item.typeName,
        value: item.id,
      }));
    });
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', this.onScroll, false);
  },
  methods: {
    handleGenerateJson(type) {
      this.jsonVisible = true;
      if (type === 'chart') {
        this.jsonTemplate = JSON.stringify(this.chartData, null, 2);
      } else if (type === 'ProTable') {
        this.jsonTemplate = JSON.stringify(proTableJson, null, 2);
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
    initFormJson() {
      getFormDetail('person').then((res) => {
        this.$nextTick(() => {
          this.$refs.formDesigner.setJSON(JSON.parse(res.data.formJson));
        });
      });
    },
    // 滚动监听器
    onScroll() {
      // 获取所有锚点元素
      const navContents = document.querySelectorAll('.container');
      // 所有锚点元素的 offsetTop
      const offsetTopArr = [];
      navContents.forEach((item) => {
        offsetTopArr.push(item.offsetTop);
      });
      // 获取当前文档流的 scrollTop
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      // 定义当前点亮的导航下标
      let navIndex = 0;
      for (let n = 0; n < offsetTopArr.length; n += 1) {
        // 如果 scrollTop 大于等于第n个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
        // 那么此时导航索引就应该是n了
        if (scrollTop + 84 >= offsetTopArr[n]) {
          navIndex = n;
        }
      }
      // 如果滚动条已经到底则直接激活最后一个导航
      if (scrollTop + document.documentElement.clientHeight === document.documentElement.scrollHeight) {
        navIndex = offsetTopArr.length - 1;
      }

      this.active = navIndex;
    },

    // 跳转到指定索引的元素
    scrollTo(index) {
      // 获取目标的 offsetTop
      const targetOffsetTop = document.querySelector(`.container:nth-child(${index + 1})`).offsetTop;

      function handleSmooth() {
        document.body.scrollTop = targetOffsetTop - 84;
        document.documentElement.scrollTop = targetOffsetTop - 84;
      }
      requestAnimationFrame(handleSmooth);
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
};
</script>

<style scoped>
.page-container {
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
  .el-main {
    padding: 0;
  }
}
.el-header {
  color: #333;
  line-height: 60px;
  background: white;
}
.top {
  box-shadow: 0 8px 24px -2px;
  padding: 0 8rem;
  position: fixed;
  display: flex;
  z-index: 200;
  align-items: center;
  justify-content: space-between;
  left: 0;
  right: 0;
  line-height: 44px;
  box-shadow: 0 3px 1px #ededed;
  text-align: center;
  .logo {
    display: flex;
    align-items: center;
    img {
      display: inline-block;
      width: 60px;
      height: 100%;
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
    display: flex;
    align-items: center;
    line-height: 10px;
    & > * {
      margin-left: 10px;
      font-size: 14px;
      color: #6171cd;
      &:hover {
        color: #4d2afc;
      }
    }
  }
}

.content {
  max-width: 1600px;
  margin: 0 auto;
  padding-top: 60px;
  .el-header {
    background: #ff9798;
  }
  .demo-actions {
    text-align: left;
    padding: 20px;
    /deep/ {
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
        border: 1px solid #e8f2f9;
        background: #f3faff;
      }
    }
  }
}

.json-btn {
  float: right;
  margin-top: 12px;
}

.el-radio-group {
  padding-left: 10px !important;
}

.dialog {
  /deep/ {
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

/* 导航栏的样式 */
.navs {
  position: fixed;
  top: 25%;
  right: 0;
  z-index: 200;
  li {
    cursor: pointer;
    display: block;
    padding: 0 8px;
    line-height: 24px;
    margin-left: -2px;
    border-left: 3px solid #dcdcdc;
    color: #242934;
    opacity: 0.6;
    font-size: 16px;
    transition: opacity 0.2s;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.active {
      border-left-color: #34538b;
      color: #34538b;
      opacity: 1;
    }
    &:hover {
      color: #34538b;
      opacity: 1;
      font-weight: 500;
    }
  }
}
</style>
