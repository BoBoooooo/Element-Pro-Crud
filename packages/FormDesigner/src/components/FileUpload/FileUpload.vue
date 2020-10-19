<!--
 * @file: 文件上传
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2019年04月28 13:45:17
-->

<template>
  <div class="upload-container">
    <el-upload v-if="view.upload && !readOnly"
               ref="upload"
               :action="uploadUrl"
               :data="uploadParams"
               :accept="accept"
               :headers="{ Authorization: this.$store.getters.token }"
               :show-file-list="false"
               :before-upload="beforeUpload"
               :on-success="uploadSuccess"
               multiple>
      <el-tooltip class="item"
                  effect="dark"
                  content="上传附件"
                  placement="bottom">
        <el-button size="mini"
                   v-show="view.uploadBtn"
                   style="float:right;"
                   :icon="btnIcon"
                   :loading="btnSaveIsLoading"
                   type="primary">{{btnText}}</el-button>
      </el-tooltip>
    </el-upload>
    <CrudTable ref="table"
               v-if="view.list"
               :listField="listField"
               emptyText="暂无附件"
               :tableName="tableName"
               :maxHeightMinus="290"
               :pageSize="[30,50,100]"
               :tableTitle="tableTitle"
               :tableParams="tableParams"
               :promiseForSelect="promiseForSelect"
               :fullHeight="fullHeight"
               :visibleList="{
                  conditionTitle: false,
                  tableTitle:view.tableTitle,
                  searchForm: view.searchForm,
                  btnAdd: false,
                  btnExport: false,
                  actionColumnBtnEdit: false,
                  actionColumnBtnDel:false,
                  tableTitle:view.tableTitle
                }"
               :paginationLayout="paginationLayout"
               :showPagination="showPagination"
               @selection="getSelection"
               :isMultiple="isMultiple"
               :row-class-name="rowClassName">
      <template #columnFormatter="{prop,row}">
        <template v-if="prop=== 'filename'">
          <span>{{row.filename}}</span>
        </template>
      </template>
      <template #btnBarPrevBtn>
        <slot name="btnBarPrevBtn"></slot>
      </template>
      <template #btnCustom="scope">
        <slot name="btnCustom"
              :row="scope.row"></slot>
        <div>
          <el-dropdown trigger="click"
                       placement="bottom"
                       class="selectButton">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <i class="el-icon-download"
                   @click="btnDownloadOnClick(scope)">
                  <span class="dropLink">
                    下载
                  </span>
                </i>
              </el-dropdown-item>

              <el-dropdown-item>
                <i class="el-icon-delete"
                   @click="btnDelOnClick(scope)">
                  <span class="dropLink">
                    删除
                  </span>
                </i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </CrudTable>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import download from '../../utils/download';
import { crud, DML } from '../../../../api/public/crud';

@Component
export default class FileUpload extends Vue {
  $refs!: {
    uploadBtn: HTMLFormElement;
    table:HTMLFormElement;
  };

  // 保存按钮Loading状态
  btnSaveIsLoading = false;

  @Prop({
    type: Boolean,
    default: false,
  })
  fullHeight!: boolean;

  @Prop({
    type: String,
    default: 'data.list',
  })
  listField!: string;

  @Prop({
    type: String,
    default: '.doc,.docx,.xls,.xlsx,.PDF',
  })
  accept!: string;

  @Prop({
    type: String,
    default: '上传附件',
  })
  btnText!: string;

  @Prop({
    type: String,
    default: '',
  })
  btnIcon!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  showPagination!: boolean;

  @Prop({
    type: String,
    default: '',
  })
  resourceid!: string;

  @Prop({
    type: Object,
    default: () => ({}),
  })
  visibleList: any;

  @Prop({
    type: String,
    default: '',
  })
  tableTitle!: string;

  @Prop({
    type: String,
    default: `${process.env.VUE_APP_API_URL}file/upload`,
  })
  uploadUrl!: string;

  @Prop({
    default: null,
    type: Function,
  })
  promiseForSelect: any;

  @Prop({
    type: String,
    default: 'file',
  })
  tableName!: string;

  // 分页显示内容
  @Prop({
    type: String,
    default: 'sizes,total,prev, pager, next',
  })
  paginationLayout!: string;

  // 是否开启多选
  @Prop({
    type: Boolean,
    default: false,
  })
  isMultiple!: boolean;

  // file列表行样式
  @Prop({
    type: [String, Function],
    default: null,
  })
  rowClassName: any;

  @Prop({
    type: String,
    default: '',
  })
  // 附件类型
  fileType!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  readOnly!: boolean;

  // 内部元素显示控制，默认只有上传人可以编辑删除
  get view() {
    return {
      btnAdd: true,
      btnDel: true,
      btnEdit: true,
      btnPreview: true,
      upload: true,
      list: true,
      btnDownload: true,
      uploadBtn: true,
      searchForm: false,
      tableTitle: true,
      ...this.visibleList,
    };
  }

  get tableParams() {
    const params:any = {};
    if (this.resourceid) {
      params.resourceid = this.resourceid;
    }
    if (this.fileType) {
      params.type = this.fileType;
    }
    return params;
  }

  get uploadParams() {
    const {
      resourceid, fileType,
    } = this;
    let params : any = {
      userid: this.$store.getters.userid,
    };
    if (resourceid) {
      params.resourceid = resourceid;
    }
    if (this.fileType) {
      params.type = this.fileType;
    }
    params = {
      ...params,
    };
    return params;
  }

  beforeUpload() {
    this.btnSaveIsLoading = true;
    this.$message({
      type: 'info',
      message: '文件上传中……',
    });
    return true;
  }

  // 文件上传成功
  uploadSuccess(res) {
    const { code } = res;
    if (code === 400) {
      this.$message({
        type: 'error',
        message: '上传失败',
      });
    } else {
      this.$message({
        type: 'success',
        message: '上传成功',
      });
      if (this.view.list) {
        this.tableReload();
      }
      this.$emit('uploadSuccess');
    }
    this.btnSaveIsLoading = false;
  }

  // 下载
  btnDownloadOnClick(scope) {
    download(`${process.env.VUE_APP_API_URL}file/download`, scope.row.filename, { id: scope.row.id });
  }

  // 删除按钮代理
  btnDelOnClick({ row }) {
    this.$confirm('此操作将删除该附件, 是否继续?', '提示', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        crud(DML.DELETE, this.tableName, {
          id: row.id,
        }).then((res:any) => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.tableReload();
          }
        });
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
  }

  // 附件列表刷新
  tableReload() {
    this.$refs.table.tableReload();
  }

  // 获取附件列表勾选项
  getSelection(data) {
    this.$emit('selection', data);
  }
}
</script>

<style scoped>
.upload-container >>> .el-upload {
  float: right;
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
<style lang="scss" scoped>
// 操作列更多按选项按钮
.selectButton {
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
