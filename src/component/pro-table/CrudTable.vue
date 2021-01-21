<!--
 * @file:
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2021-01-20 10:00:48
-->
<!--
 * @file: el-table CrudTable封装,支持高级查询 分页 增删改查表单
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年09月14 18:01:58
-->

<template>
  <div class="CrudTable">
    <div class="base-table">
      <!-- 表格主体 -->
      <ProTable v-bind="$attrs"
                v-on="$listeners"
                ref="table"
                @selection-change="handleSelectionChange"
                :visibleList="view"
                :columns="tableConfig"
                :request="request"
                :lazy="lazy"
                :load="treeload"
                :tree-props="{children: 'children', hasChildren: 'flag'}">
          <template #btnBarPrevBtn>
              <!-- 批量删除按钮 -->
            <el-button v-if="view.btnDel"
                      @click="btnDeletesOnClick"
                      type="danger"
                      size="mini"
                      icon="el-icon-delete">{{text.multiDel}}</el-button>
            <!-- 添加按钮 -->
            <el-button v-if="view.btnAdd"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      @click.stop="btnAdd()">{{text.add}}</el-button>
          </template>
          <!-- 列表头添加按钮 -->
          <template #_action_header v-if="view.btnAddOnColumnHeader">
            <el-button icon="el-icon-plus"
                       size="mini"
                       type="primary"
                       style="color:white"
                       @click.stop="btnAdd"></el-button>
          </template>
          <template #columnFormatter="{row,prop}">
            <slot name="columnFormatter" :row="row" :prop="prop"></slot>
          </template>
          <template slot-scope="scope" slot="actionColumn">
              <!-- 操作列-添加按钮 -->
              <el-button v-if="view.actionColumnBtnAdd"
                         icon="el-icon-plus"
                         type="primary"
                         size="mini"
                         @click.stop="actionColumnAdd(scope.row)">{{text.add}}</el-button>
              <!-- 操作列-编辑按钮 -->
              <template v-if="actionColumnBtnEditVisible(scope.row)">
                <el-button type="success"
                           size="mini"
                           @click.stop="actionColumnEdit(scope.row)">{{text.edit}}</el-button>
              </template>
              <!-- 操作列-查看按钮 -->
              <el-button v-if="actionColumnBtnDetailVisible(scope.row)"
                         type="primary"
                         size="mini"
                         @click.stop="actionColumnDetail(scope.row)">{{text.detail}}</el-button>

              <!-- 操作列-删除按钮 -->
              <el-button v-if="actionColumnBtnDelVisible(scope.row)"
                         type="danger"
                         size="mini"
                         @click.stop="actionColumnDel(scope.row)">{{text.del}}</el-button>
              <!-- 自定义按钮 -->
              <slot name="btnCustom"
                    :row="scope.row" />
          </template>
      </ProTable>
       <!-- 新增、编辑、查看按钮 弹出 表单-->
    <GenerateFormDialog ref="dialog"
                        :tableName="tableName"
                        :dialogFormDesignerName="dialogFormDesignerName"
                        :tableParams="tableParams"
                        @afterSave="tableReload"
                        :textMap="text"
                        @change="formChange"
                        :formValuesAsync="formValuesAsync"
                        :formTableConfig="formTableConfig"
                        :remoteFuncs="remoteFuncs"
                        :visibleList="view"
                        :readOnly="readOnly"
                        :append-to-body="dialogAppendToBody"
                        :close_on_click_modal="dialogCloseOnClickModal"
                        :fullscreen="dialogFullscreen"
                        :width='dialogWidth'
                        @btnOnClick="formBtnOnClick">
      <template #dialogFooter>
        <slot name="dialogFooter"></slot>
      </template>
    </GenerateFormDialog>
  </div>
</div>
</template>

<script lang="ts">
import {
  Component, Vue, Emit, Prop, Watch,
} from 'vue-property-decorator';
import { confirm } from '@/utils/confirm';
import SvgIcon from '@/icons/SvgIcon.vue';
import _cloneDeep from 'lodash/cloneDeep';
import { DML } from '@/types/common';
import GenerateFormDialog from './src/GenerateFormDialog.vue';
import ProTable from './src/ProTable.vue';


const STATUS = {
  CREATE: 0,
  UPDATE: 1,
  DETAIL: 2,
};
@Component({
  name: 'CrudTable',
  components: {
    GenerateFormDialog,
    SvgIcon,
    ProTable,
  },
})
export default class CrudTable extends Vue {
  // https://github.com/vuejs/vue-class-component/issues/94
  $refs!: {
    table: HTMLFormElement;
    dialog: HTMLFormElement;
    searchForm: HTMLFormElement;
    TableDesigner: HTMLFormElement;
  };

  // 当前点击行
  currentRow: any = {};

  // 已选择行
  selectedRows: any = [];

  // 表格结构json，将来可能有多张表
  tableConfig = { columns: [] };

  // 表格数据
  tableData = [];

  // listField
  @Prop({
    type: String,
    default: 'data.list',
  })
  listField!: string;

  // 设置只读
  @Prop({ default: false, type: Boolean }) readOnly!: any;

  // 添加对话框预填项
  @Prop({ default: null, type: Object }) prefill!: any;

  // 弹出表单appendToBody
  @Prop({ default: true, type: Boolean }) dialogAppendToBody!: boolean;

  // 弹出表单width
  @Prop({ default: '80%', type: String }) dialogWidth!: string;

  // 用于请求表格设计json的name
  @Prop({
    type: String,
    default: null,
  })
  tableDesignerName!: string;

  // 对话框内加载FormDesigner的表名
  @Prop({
    type: String,
    default: null,
  })
  dialogFormDesignerName!: string;

  // 内部元素显示控制
  @Prop({ default: () => ({}), type: Object }) visibleList!: any;

  // 表名
  @Prop({
    type: String,
    default: '',
  })
  tableName!: string;

  // 按钮名字
  @Prop({ default: () => ({}), type: Object }) textMap!: any;

  // 删除方法代理
  @Prop({ default: null, type: Function }) promiseForDel!: any;

  // 批量删除方法代理
  @Prop({ default: null, type: Function }) promiseForDels!: any;

  // 详情方法代理
  @Prop({ default: null, type: Function }) promiseForDetail!: any;

  // 代理保存方法
  @Prop({ default: null, type: Function }) promiseForSave!: any;

  // 请求数据方法代理
  @Prop({ default: null, type: Function }) promiseForSelect!: any;

  // 删除按钮是否可见代理
  @Prop({ default: null, type: Function }) btnDelVisibleFunc!: any;

  // 编辑按钮是否可见代理
  @Prop({ default: null, type: Function }) btnEditVisibleFunc!: any;

  // 表格行中的添加按钮是否显示事件
  @Prop({ default: null, type: Function }) btnAddVisibleFunc!: any;

  // 查看按钮是否可见代理
  @Prop({ default: null, type: Function }) btnDetailVisibleFunc!: any;

  // 表格添加按钮点击事件
  @Prop({ default: null, type: Function }) btnAddOnClick!: any;

  // 表格行中的编辑按钮点击事件
  @Prop({ default: null, type: Function }) btnEditOnClick!: any;

  // 表格行中的查看按钮点击事件
  @Prop({ default: null, type: Function }) btnDetailOnClick!: any;

  // 表格行中的添加按钮点击事件
  @Prop({ default: null, type: Function }) btnRowAddOnClick!: any;

  // 远程数据方法
  @Prop({ default: () => ({}), type: Object }) remoteFuncs!: any;

  // 高度minus
  @Prop({ type: Number, default: 270 }) maxHeightMinus!: number;


  // 点击阴影弹框是否可以关闭
  @Prop({ default: true, type: Boolean }) dialogCloseOnClickModal!: boolean;

  // 表单是否全屏
  @Prop({ default: false, type: Boolean }) dialogFullscreen!: boolean;


  // 异步更新表单数据
  @Prop({ default: () => ({}), type: Object }) formValuesAsync!: any;

  // 子表tableConfig 详情看GenerateFormItem中解释
  @Prop({ default: () => ({}), type: Object }) formTableConfig!: any;


  // 操作列宽度
  @Prop({ type: Number, default: null }) actionColumnWidth!: number;

  // totalField
  @Prop({
    type: String,
    default: 'data.total',
  })
  totalField!: string;

  // tableParams 预设查询参数
  @Prop({
    type: [Object, Array],
    default: () => ({}),
  })
  tableParams!: any;

  // 是否懒加载
  @Prop(Boolean) lazy!: boolean;


  // 文本映射
  get text() {
    return {
      add: '添加',
      edit: '编辑',
      del: '删除',
      detail: '查看',
      multiDel: '批量删除',
      ...this.textMap,
    };
  }

  // 内部元素显示控制
  get view() {
    const viewObj = {
      searchForm: true,
      tableTitle: false,
      btnAdd: true,
      btnDel: false,
      actionColumnBtnAdd: false,
      actionColumnBtnEdit: true,
      actionColumnBtnDetail: false,
      actionColumnBtnDel: true,
      actionColumn: true,
      seniorSearchBtn: true,
      btnAddOnColumnHeader: false,
      ...this.visibleList,
    };
    // 只读模式隐藏添加编辑删除按钮
    if (this.readOnly) {
      viewObj.btnAdd = false;
      viewObj.btnAddOnColumnHeader = false;
      viewObj.actionColumnBtnDel = false;
      viewObj.actionColumnBtnEdit = false;
      viewObj.actionColumnBtnDetail = true;
    }
    // 操作列是否隐藏
    if (!viewObj.actionColumn) {
      this.tableConfig.columns = this.tableConfig.columns.filter((item: any) => item.slotName !== 'actionColumn');
    }
    return viewObj;
  }

  created() {
    // 请求表格设计json
    const promise = this.$PROCRUD.getTableDetail(this.tableDesignerName ? this.tableDesignerName : this.tableName);
    // 加载表格结构
    promise.then((res) => {
      this.tableConfig = JSON.parse(res.data.formJson);
      const { actionColumnWidth } = this;
      // 如果显示指明了操作列列宽
      if (actionColumnWidth) {
        const actionColumn: any = this.tableConfig.columns.find((item: any) => item.slotName === 'actionColumn');
        if (actionColumn) {
          actionColumn.width = actionColumnWidth;
          actionColumn.minWidth = actionColumnWidth;
        }
      }
    });
  }

  // 表格刷新
  tableReload() {
    this.$refs.table.tableReload();
  }

  // 添加
  btnAdd() {
    if (this.btnAddOnClick) {
      this.btnAddOnClick();
    } else if (this.prefill) {
      // 对话框内加载预填项
      this.$refs.dialog.showDialog({}, 0, this.prefill);
    } else {
      this.$refs.dialog.showDialog();
    }
  }

  // 操作列-添加
  actionColumnAdd(row) {
    // 添加成功后需要刷新当前结点的子节点,此处特殊处理
    this.currentRow.parentid = _cloneDeep(row).id;
    if (this.btnRowAddOnClick) {
      this.btnRowAddOnClick(row);
    } else if (this.prefill) {
      // 对话框内加载预填项
      // 此处跟正常情况的preFill不一样
      // 此处传的为Array
      // 用于tree接口点添加自动赋值parentid的情况
      // 例如传 { parentid : id} 则表示添加的parentid = row.id
      const obj = {};
      Object.keys(this.prefill).forEach((key) => {
        obj[key] = row[this.prefill[key]];
      });
      this.$refs.dialog.showDialog({}, 0, obj);
    } else {
      this.$refs.dialog.showDialog();
    }
  }

  // 操作列-编辑
  actionColumnEdit(row) {
    this.currentRow = row;
    if (this.btnEditOnClick) {
      this.btnEditOnClick(row);
    } else {
      const promise = this.promiseForDetail
        ? this.promiseForDetail(row.id)
        : this.$PROCRUD.crud(
          DML.DETAIL,
          this.tableName,
          {},
          {
            id: row.id,
          },
        );
      // 请求后台detail接口获取表单数据
      promise.then((res) => {
        this.$refs.dialog.showDialog({ id: row.id }, STATUS.UPDATE, res.data);
      });
    }
  }

  // 操作列-查看
  actionColumnDetail(row) {
    this.currentRow = row;
    if (this.btnDetailOnClick) {
      this.btnDetailOnClick(row);
    } else {
      const promise = this.promiseForDetail
        ? this.promiseForDetail(row.id)
        : this.$PROCRUD.crud(
          DML.DETAIL,
          this.tableName,
          {},
          {
            id: row.id,
          },
        );
      // 请求后台detail接口获取表单数据
      promise.then((res) => {
        this.$refs.dialog.showDialog({ id: row.id }, STATUS.DETAIL, res.data);
      });
    }
  }

  handleSelectionChange(selection) {
    this.selectedRows = selection;
  }

  // 批量删除按钮
  btnDeletesOnClick() {
    const { length } = this.selectedRows || [];
    if (length > 0) {
      this.$confirm(`已选中${length}项,确认删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const promise = this.promiseForDels
            ? this.promiseForDels(this.selectedRows.map(item => item.id))
            : this.$PROCRUD.crud(
              DML.DELETES,
              this.tableName,
              this.selectedRows.map(item => item.id),
            );
          promise.then(() => {
            this.tableReload();
            this.$message.success('批量删除成功');
          });
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    } else {
      this.$message('请先选择删除项');
    }
  }

  // 操作列-删除
  @confirm('确认删除?', '提示')
  actionColumnDel(row) {
    this.currentRow = row;
    // 如果prop传入了promiseForDel说明需要回调自定义删除
    const promise = this.promiseForDel ? this.promiseForDel(row.id) : this.$PROCRUD.crud(DML.DELETE, this.tableName, {}, { id: row.id });
    promise.then(() => {
      this.tableReload();
      this.$message({
        type: 'success',
        message: '删除成功',
      });
    });
  }

  // 操作列-添加按钮是否显示
  actionColumnBtnAddVisible(row) {
    let visible;
    if (this.btnAddVisibleFunc) {
      // 如果传入了计算函数，取函数结果
      visible = this.btnAddVisibleFunc(row);
    } else {
      // 默认不显示
      visible = this.view.actionColumnBtnAdd;
    }
    return visible;
  }

  // 操作列-编辑按钮是否显示
  actionColumnBtnEditVisible(row) {
    let visible;
    if (this.btnEditVisibleFunc) {
      // 如果传入了计算函数，取函数结果
      visible = this.btnEditVisibleFunc(row);
    } else {
      // 默认不显示
      visible = this.view.actionColumnBtnEdit;
    }
    return visible;
  }

  // 操作列-详情按钮是否显示
  actionColumnBtnDetailVisible(row) {
    let visible;
    // 如果传入了计算函数，取函数结果
    if (this.btnDetailVisibleFunc) {
      visible = this.btnDetailVisibleFunc(row);
    } else {
      // 默认不显示
      visible = this.view.actionColumnBtnDetail;
    }
    return visible;
  }

  // 操作列-删除按钮是否显示
  actionColumnBtnDelVisible(row) {
    let visible;
    if (this.btnDelVisibleFunc) {
      // 如果传入了计算函数，取函数结果
      visible = this.btnDelVisibleFunc(row);
    } else {
      // 默认显示
      visible = this.view.actionColumnBtnDel;
    }
    return visible;
  }

  // 生成的按钮点击
  formBtnOnClick(widget) {
    this.$emit('form-btn-on-click', widget);
  }

  // 监听dialog中form对象改变
  formChange(val) {
    this.$emit('form-change', val);
  }


  async request(axiosParams) {
    // 已加载完成, tree lazy table 局部刷新.
    // 懒加载待重构
    if (this.lazy) {
      this.treeload({
        id: this.currentRow.parentid,
      });
      return;
    }
    // 发起请求
    // eslint-disable-next-line no-nested-ternary
    const requestObject = this.promiseForSelect
      ? this.promiseForSelect(axiosParams)
      : this.lazy
        ? this.$PROCRUD.crud(DML.TREE_LAZY, this.tableName, axiosParams)
        : this.$PROCRUD.crud(DML.SELECT, this.tableName, axiosParams);

    const response = await requestObject;
    let result = response;
    // 此处判断返回的数据格式
    // 和后台默认约束好的resultBean格式如下:
    /**
         * {
         *    code: 200,
         *    data: {
         *      list: [],
         *      total: 0,
         *    };
         *    message: SUCCESS
         * }
         */
    if (response && !Array.isArray(response)) {
      // 此处listField默认为 data.list
      result = this.listField.split('.').reduce((res, key) => res[key], response);
    }
    // 判断拿到的list是否为Array
    if (!result || !Array.isArray(result)) {
      throw new Error(`The result of key:${this.listField} is not Array.`);
    }
    let totalValue = response;
    // 如果返回直接为list,则说明没有分页处理,直接统计length作为总数
    if (Array.isArray(response)) {
      totalValue = response.length;
    } else if (typeof response === 'object') {
      // 此处totalField默认为data.total
      totalValue = this.totalField.split('.').reduce((res, key) => res[key], response);
    } else {
      totalValue = 0;
    }
    // eslint-disable-next-line consistent-return
    return {
      total: totalValue,
      data: result,
    };
  }

  /** 懒加载树 */
  treeload(tree, treeNode?: any, resolve?: any) {
    const { tableName } = this;
    const data = {
      searchCondition: [
        {
          field: 'parentid',
          operator: 'eq',
          value: tree.id,
        },
      ],
    };

    this.$PROCRUD.crud(DML.TREE_LAZY, this.tableName, data).then((res) => {
      if (resolve) {
        resolve(res.data);
      }
      // 强制更新已渲染子结点
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, tree.id, res.data);
    });
  }

  /**
   * 下列为dev模式代码,不需要可自行删除
   *
   */
  tableOnSave({ tableDesign }) {
    this.tableConfig = tableDesign;
    // 如果不显示操作列,则隐藏
    if (!this.view.actionColumn) {
      this.tableConfig.columns = this.tableConfig.columns.filter((item: any) => item.slotName !== 'actionColumn');
    }
    const { actionColumnWidth } = this;
    // 如果显示指明了操作列列宽
    if (actionColumnWidth) {
      const actionColumn: any = this.tableConfig.columns.find((item: any) => item.slotName === 'actionColumn');
      if (actionColumn) {
        actionColumn.width = actionColumnWidth;
        actionColumn.minWidth = actionColumnWidth;
      }
    }
  }

  async showTableDesigner() {
    const res = await this.$PROCRUD.getTableDetail(this.tableDesignerName || this.tableName);
    this.$refs.TableDesigner.showDialog({ id: res.data.id }, 1, res.data);
  }
}
</script>

<style scoped>
/* 修改暂无数据样式 */
.base-table >>> .el-table__empty-text {
  line-height: 10px;
  margin-bottom: 15px;
  color: rgba(0, 0, 0, 0.25) !important;
  font-size: 14px;
}
.base-table >>> .empty_icon {
  width: 4em;
  height: 4em;
  display: block;
  margin: 0 auto;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.CrudTable {
  background: white;
  padding: 10px;
  position: relative;
  h4 {
    margin: 2px 30px 0px 0px;
    padding-left: 15px;
    font-weight: 500;
    font-size: 18px;
  }
  .table-title {
    float: left;
    margin-left: 5px;
  }
  .table-title-absolute {
    position: absolute;
    top: 110px;
    left: 10px;
  }
  .btn-bar {
    float: right;
    width: auto;
    text-align: right;
    & > div,
    button {
      float: right;
      margin-left: 10px;
    }
  }
  .dev-module {
    display: inline-block;
    margin-left: 20px;
    line-height: 28px;
    button {
      padding: 0;
    }
  }
}
</style>
