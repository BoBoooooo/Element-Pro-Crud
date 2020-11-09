<!--
 * @file: el-table CrudTable封装,支持高级查询 分页 增删改查表单
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年09月14 18:01:58
-->

<template>
  <div class="CrudTable">
    <div class="base-table">
      <!-- 表格左侧标题 -->
      <div class="table-title"
           v-if="view.tableTitle && tableTitle">
        <!-- 表格标题 -->
        <h4>{{tableTitle}}</h4>
      </div>
      <!-- table右上角按钮 -->
      <div class="btn-bar">
        <slot name="btnBarPrevBtn" />
        <!-- 批量删除按钮 -->
        <el-button v-if="view.btnDel"
                   @click="btnDeletesOnClick"
                   type="primary"
                   size="mini"
                   icon="el-icon-delete">删除</el-button>
        <!-- 添加按钮 -->
        <el-button v-if="view.btnAdd"
                   type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click.stop="btnAdd()">{{text.add}}</el-button>
      </div>

      <SearchForm ref="searchForm"
                  v-if="view.searchForm"
                  :showSeniorSearchFormButton="view.seniorSearchBtn"
                  :columns="tableConfig.columns"
                  @click="fetchHandler(false,true)"
                  :searchFormCondition.sync="searchFormCondition"
                  :remoteFuncs="remoteFuncs"
                  :isLoading="loading"
                  @clear="dataChangeHandler(true)">
                  <template #seniorSearchForm>
                    <slot name="seniorSearchForm"></slot>
                  </template>
      </SearchForm>
      <!-- 表格主体 -->
      <el-table v-loading.lock="loading"
                element-loading-text="加载中……"
                ref="table"
                :header-cell-style="{ background: '#f2f2f2', color: '#737373' }"
                :data="tableData"
                :border="border"
                :size="size"
                :stripe="stripe"
                :height="tableHeight"
                :max-height="maxHeight"
                :fit="fit"
                :show-header="showHeader"
                :highlight-current-row="highlightCurrentRow"
                :current-row-key="currentRowKey"
                :row-class-name="rowClassName"
                :row-style="rowStyle"
                :cell-style="cellStyle"
                :empty-text="emptyText"
                :default-expand-all="defaultExpandAll"
                :expand-row-keys="expandRowKeys"
                :default-sort="defaultSort"
                :tooltip-effect="tooltipEffect"
                :show-summary="showSummary"
                :sum-text="sumText"
                :row-key="(row)=> row.id"
                :summary-method="summaryMethod"
                rowKey="id"
                :lazy="lazy"
                :load="treeload"
                :tree-props="{children: 'children', hasChildren: 'flag'}"
                :style="tableStyle"
                @select="(selection, row) => emitTableEvent('select', selection, row)"
                @select-all="(selection) => emitTableEvent('select-all', selection)"
                @selection-change="(selection) => handleSelectionChange(selection)"
                @cell-mouse-enter="(row, column, cell, event) => emitTableEvent('cell-mouse-enter', row, column, cell, event)"
                @cell-mouse-leave="(row, column, cell, event) => emitTableEvent('cell-mouse-leave', row, column, cell, event)"
                @cell-click="(row, column, cell, event) => emitTableEvent('cell-click', row, column, cell, event)"
                @cell-dblclick="(row, column, cell, event) => emitTableEvent('cell-dblclick', row, column, cell, event)"
                @row-click="(row, event, column) => emitTableEvent('row-click', row, event, column)"
                @row-dblclick="(row, event) => emitTableEvent('row-dblclick', row, event)"
                @row-contextmenu="(row, event) => emitTableEvent('row-contextmenu', row, event)"
                @header-click="(column, event) => emitTableEvent('header-click', column, event)"
                @sort-change="(args) => sortChange(args)"
                @filter-change="(filters) => emitTableEvent('filter-change', filters)"
                @current-change="(currentRow, oldCurrentRow) => emitTableEvent('current-change', currentRow, oldCurrentRow)"
                @header-dragend="(newWidth, oldWidth, column, event) => emitTableEvent('header-dragend', newWidth, oldWidth, column, event)"
                @expand-change="(row, expanded) => emitTableEvent('expand-change', row, expanded)">
        <template slot='empty'>
          <SvgIcon icon-class='table_empty'
                   class="empty_icon"></SvgIcon>
          <span>暂无数据</span>
        </template>
        <el-table-column v-if="isMultiple || view.btnDel"
                         type="selection"
                         reserve-selection
                         align="center"
                         header-align="center"
                         width="55"
                         :selectable="selectableFunc"> </el-table-column>
        <el-table-column v-if="showColumnIndex"
                         type="index"
                         align="center"
                         label="#"
                         header-align="center"
                         width="50"> </el-table-column>
        <el-table-column v-for="(column, columnIndex) in tableConfig.columns"
                         :key="columnIndex"
                         :column-key="column.columnKey"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.minWidth ? '-' : column.width || 140"
                         :min-width="column.minWidth || column.width || 140"
                         :fixed="column.fixed"
                         :render-header="column.renderHeader"
                         :sortable="column.sortable == 'false' ? false : column.sortable"
                         :sort-by="column.sortBy"
                         :sort-method="column.method"
                         :resizable="column.resizable"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.showOverflowTooltip"
                         :align="column.align"
                         :header-align="column.headerAlign || column.align"
                         :class-name="column.className"
                         :label-class-name="column.labelClassName"
                         :selectable="column.selectable"
                         :reserve-selection="column.reserveSelection"
                         :filters="column.filters"
                         :filter-placement="column.filterPlacement"
                         :filter-multiple="column.filterMultiple"
                         :filter-method="column.filterMethod"
                         :filtered-value="column.filteredValue">
          <!-- 此处暂时只考虑操作列表头的处理 -->
          <template slot="header"
                    v-if="view.btnAddOnColumnHeader && column.slotName === 'actionColumn'">
            <!-- 添加按钮 -->
            <el-button icon="el-icon-plus"
                       size="mini"
                       type="primary"
                       style="color:white"
                       @click.stop="btnAdd()"></el-button>
          </template>

          <template slot-scope="scope">
            <span v-if="column.slotName === 'actionColumn'">
              <!-- 操作列-添加按钮 -->
              <el-button v-if="view.actionColumnBtnAdd"
                         icon="el-icon-plus"
                         type="primary"
                         size="mini"
                         @click.stop="actionColumnAdd(scope.row)">{{text.add}}</el-button>
              <!-- 操作列-编辑按钮 -->
              <template v-if="actionColumnBtnEditVisible(scope.row)">
                <!-- 正常编辑按钮 -->
                <el-button type="success"
                           size="mini"
                           @click.stop="actionColumnEdit(scope.row)">{{text.edit}}</el-button>
              </template>
              <!-- 查看按钮 -->
              <el-button v-if="actionColumnBtnDetailVisible(scope.row)"
                         type="primary"
                         size="mini"
                         @click.stop="actionColumnDetail(scope.row)">{{text.detail}}</el-button>

              <!-- 操作列-删除按钮，支持传入btnDelVisibleFunc()用于判断按钮显示状态 -->
              <el-button v-if="actionColumnBtnDelVisible(scope.row)"
                         type="danger"
                         size="mini"
                         @click.stop="actionColumnDel(scope.row)">{{text.del}}</el-button>
              <!-- 自定义按钮 -->
              <slot name="btnCustom"
                    :row="scope.row" />
            </span>
            <span v-else-if="column.slotName  && column.slotName !== 'actionColumn'">
              <slot :name="column.slotName"
                    :row="scope.row"
                    :prop="column.prop"
                    :$index="scope.$index" />
            </span>
            <span v-else>
              {{ scope.row[column.prop] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="overflow:hidden;background:white"
           class="mt-8">
        <!-- 表格底部左侧功能按钮 -->
        <div style="float:left">
          <slot name="bottom-btn"></slot>
        </div>
        <el-pagination v-if="showPagination"
                       :current-page="pagination.pageIndex"
                       :page-sizes="pageSizes"
                       :page-size="pagination.pageSize"
                       :layout="paginationLayout"
                       :pager-count="pagerCount"
                       :small="pagerSmall"
                       :total="total"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       style="float:right" />
      </div>
    </div>
    <!-- 新增、编辑、查看按钮 弹出 表单-->
    <GenerateFormDialog ref="dialog"
                        :tableName="tableName"
                        :dialogFormDesignerName="dialogFormDesignerName"
                        :tableParams="tableParams"
                        @afterSave="tableReload"
                        @change="formChange"
                        :formValuesAsync="formValuesAsync"
                        :formTableConfig="formTableConfig"
                        :remoteFuncs="remoteFuncs"
                        :visibleList="view"
                        :setReadOnly="setReadOnly"
                        :append-to-body="appendToBody"
                        :close_on_click_modal="closeOnClickModal"
                        :fullscreen="fullscreen"
                        @btnonclick="formBtnOnClick">
                        <template #dialogFooter>
                          <slot name="dialogFooter"></slot>
                        </template>
    </GenerateFormDialog>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Emit, Prop,
} from 'vue-property-decorator';
import { DML, crud } from '@/api/public/crud';
import { getTableDetail, getFormDetail } from '@/api/system/form';
import { confirm } from '@/utils/confirm';
import SvgIcon from '@/icons/SvgIcon.vue';
import GenerateFormDialog from './GenerateFormDialog.vue';
import SearchForm from './SearchForm.vue';
import _cloneDeep from 'lodash/cloneDeep'

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
  DETAIL: 2,
};
@Component({
  name: 'CrudTable',
  components: {
    GenerateFormDialog,
    SearchForm,
    SvgIcon,
  },
})
export default class CrudTable extends Vue {
  // https://github.com/vuejs/vue-class-component/issues/94
  $refs!: {
    table: HTMLFormElement;
    dialog: HTMLFormElement;
    searchForm: HTMLFormElement;
  };

  // 当前点击行
  currentRow: any = {};

  // 结果总数
  total = 0;

  // 是否在加载
  loading = false;

  // 排序参数
  sortParams = {
    orderCondition: '',
  };

  // 最大页码按钮数
  pagerCount = 7;

  // 是否显示小型分页
  pagerSmall = false;

  // 高级查询Condition
  searchFormCondition = [];

  // 表格最大高度
  maxHeight: string | number = '100%';

  // 表格高度
  tableHeight: number | string = '100%';

  // 表格结构json，将来可能有多张表
  tableConfig = { columns: [] };

  // 多选行选中项
  selectedRows: any = [];

  // 表格数据
  tableData = [];

  // listField
  @Prop({
    type: String,
    default: 'data.list',
  })
  listField!: string;

  // 设置只读
  @Prop({ default: null, type: Object }) setReadOnly!: any;

  // 添加对话框预填项
  @Prop({ default: null, type: Object }) prefill!: any;

  // 弹出表单appendToBody
  @Prop({ default: false, type: Boolean }) dialogAppendToBody!: boolean;

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

  // 表格标题
  @Prop({
    type: String,
    default: '',
  })
  tableTitle!: string;

  // 按钮名字
  @Prop({ default: () => ({}), type: Object }) textMap!: any;

  // 删除方法代理
  @Prop({ default: null, type: Function }) promiseForDel!: any;

  // 请求数据方法代理
  @Prop({ default: null, type: Function }) promiseForSelect!: any;

  // 删除按钮是否可见代理
  @Prop({ default: null, type: Function }) btnDelVisibleFunc!: any;

  // 编辑按钮是否可见代理
  @Prop({ default: null, type: Function }) btnEditVisibleFunc!: any;

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

  // 是否显示分页
  @Prop({ default: true, type: Boolean }) showPagination!: boolean;

  // 远程数据方法
  @Prop({ default: () => ({}), type: Object }) remoteFuncs!: any;

  // 页码大小
  @Prop({ default: () => [20, 50, 100] }) pageSizes!: number[];

  // 分页显示
  @Prop({
    type: String,
    default: 'total, prev, pager, next, jumper, sizes',
  })
  paginationLayout!: string;

  // 是否自适应屏幕高度
  @Prop({ type: Boolean, default: false }) fullHeight!: boolean;

  // 高度minus
  @Prop({ type: Number, default: 270 }) maxHeightMinus!: number;

  // el-table height
  @Prop(Number) height!: number;

  // 点击阴影弹框是否可以关闭
  @Prop({ default: true, type: Boolean }) dialogCloseOnClickModal!: boolean;

  // 表单是否全屏
  @Prop({ default: false, type: Boolean }) dialogFullscreen!: boolean;

  // 是否显示序号列
  @Prop({ default: false }) showColumnIndex!: boolean;

  // 边框线
  @Prop({ type: Boolean, default: false }) border!: boolean;

  // 斑马纹
  @Prop({ type: Boolean, default: true }) stripe!: boolean;

  // 异步更新表单数据
  @Prop({ default: () => ({}), type: Object }) formValuesAsync!: any;

  // 子表tableConfig 详情看GenerateFormItem中解释
  @Prop({ default: () => ({}), type: Object }) formTableConfig!: any;

  // 行样式
  @Prop({
    default: () => ({
      height: '20px',
    }),
    type: Function,
  })
  rowStyle!: any;

  // 单元格样式
  @Prop({
    default: () => ({
      padding: '5px',
    }),
    type: Function,
  })
  cellStyle!: any;

  // 操作列宽度
  @Prop({ type: Number, default: null }) actionColumnWidth!: number;

  // 是否需要多选
  @Prop({ default: true, type: Boolean }) isMultiple!: boolean;

  // 排序条件
  @Prop({ default: null, type: String }) orderCondition!: string;

  // 远程数据方法
  @Prop(String) size!: string;

  // 远程数据方法
  @Prop({
    type: Boolean,
    default: true,
  })
  fit!: boolean;

  // el-table showHeader
  @Prop({
    type: Boolean,
    default: true,
  })
  showHeader!: boolean;

  // el-table highlightCurrentRow
  @Prop(Boolean) highlightCurrentRow!: boolean;

  // el-table currentRowKey
  @Prop([String, Function]) currentRowKey!: any;

  // el-table rowClassName
  @Prop([String, Function]) rowClassName!: any;

  // el-table rowKey
  @Prop([String, Function]) rowKey!: any;

  // el-table emptyText
  @Prop(String) emptyText!: string;

  // el-table defaultExpandAll
  @Prop(Boolean) defaultExpandAll!: boolean;

  // el-table expandRowKeys
  @Prop(Array) expandRowKeys!: any;

  // el-table defaultSort
  @Prop(Object) defaultSort!: any;

  // el-table tooltipEffect
  @Prop(String) tooltipEffect!: string;

  // el-table showSummary
  @Prop(Boolean) showSummary!: boolean;

  // el-table sumText
  @Prop(String) sumText!: string;

  // el-table summaryMethod
  @Prop(Function) summaryMethod!: any;

  // 自定义tableStyle
  @Prop({
    type: String,
    default: 'width:100%;',
  })
  tableStyle!: string;

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

  // pageIndexKey
  @Prop({ default: 'pageIndex', type: String }) pageIndexKey!: string;

  // pageSizeKey
  @Prop({ default: 'pageSize', type: String }) pageSizeKey!: string;

  // 选择行是否可选
  @Prop({ default: null, type: Function }) selectableFunc: any;

  // 是否懒加载
  @Prop(Boolean) lazy!: boolean;

  // 分页
  get pagination() {
    return {
      pageIndex: 1,
      pageSize: ((): number => {
        const { pageSizes } = this;
        if (pageSizes.length > 0) {
          return pageSizes[0];
        }
        return 20;
      })(),
    };
  }


  // 文本映射
  get text() {
    return {
      add: '添加',
      edit: '编辑',
      del: '删除',
      detail: '查看',
      ...this.textMap,
    };
  }

  // 内部元素显示控制
  get view() {
    return {
      searchForm: true,
      tableTitle: true,
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
  }

  created() {
    // 请求表格设计json
    const promise = getTableDetail(this.tableDesignerName ? this.tableDesignerName : this.tableName);
    // 加载表格结构
    promise.then((res) => {
      this.tableConfig = JSON.parse(res.data.formJson);
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
    });
  }

  // 表格刷新
  tableReload() {
    this.dataChangeHandler();
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
      // 请求后台detail接口获取表单数据
      crud(DML.DETAIL, this.tableName, {}, {
        id: row.id,
      }).then((res) => {
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
      // 请求后台detail接口获取表单数据
      crud(DML.DETAIL, this.tableName, {}, {
        id: row.id,
      }).then((res) => {
        this.$refs.dialog.showDialog({ id: row.id }, STATUS.DETAIL, res.data);
      });
    }
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
          const promise = crud(
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
    const promise = this.promiseForDel ? this.promiseForDel({ id: row.id }) : crud(DML.DELETE, this.tableName, { id: row.id });
    promise.then(() => {
      this.tableReload();
      this.$message({
        type: 'success',
        message: '删除成功',
      });
    });
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

  // 多选事件
  handleSelectionChange(selection) {
    this.selectedRows = selection;
    this.$emit('selection-change', selection);
  }

  // 生成的按钮点击
  formBtnOnClick(widget) {
    this.$emit('form-btn-on-click', widget);
  }

  // 监听dialog中form对象改变
  formChange(val) {
    this.$emit('form-change', val);
  }

  mounted() {
    // 初始化表格高度
    this.setMaxHeight();
    // 请求数据
    this.fetchHandler(true);

    // 自适应分页组件按钮;
    window.addEventListener('resize', this.resizeHandler);
  }

  resizeHandler() {
    this.setPagerByWidth();
    this.setMaxHeight();
  }

  setMaxHeight() {
    const h = document.documentElement.clientHeight || document.body.clientHeight;
    this.maxHeight = Math.max(0, h - this.maxHeightMinus);
    this.tableHeight = this.fullHeight ? this.maxHeight : this.height;
  }

  // 根据表格宽度自动调整分页栏大小
  setPagerByWidth() {
    if (this.$refs.table && this.$refs.table.$el.clientWidth < 655) {
      this.pagerCount = 5;
      this.pagerSmall = true;
    } else {
      this.pagerCount = 7;
      this.pagerSmall = false;
    }
  }

  // pageSize改变事件
  handleSizeChange(size) {
    this.pagination.pageSize = size;
    this.dataChangeHandler();
  }

  // pageIndex改变事件
  handleCurrentChange(pageIndex) {
    this.pagination.pageIndex = pageIndex;
    this.dataChangeHandler();
  }

  dataChangeHandler(clearParams = false) {
    this.fetchHandler(clearParams);
  }

  fetchHandler(clearParams = false, resetPageIndex = false) {
    let searchCondition: any[] = [];
    this.loading = true;
    const {
      showPagination, pageIndexKey, pageSizeKey, pagination, listField, totalField,
    } = this;
    const { tableParams, searchFormCondition } = this;

    // 已加载完成, tree lazy table 局部刷新.
    if (this.lazy && this.tableData.length > 0) {
      this.treeload({
        id: this.currentRow.parentid,
      });
      this.loading = false;
      return;
    }

    // 如清空查询条件,则清空
    if (clearParams) {
      searchCondition = [];
    } else {
      searchCondition = searchCondition.concat(searchFormCondition);
    }
    // 此处为外部传入的tableParams,不做清空处理!
    if (this.tableParams) {
      Object.keys(tableParams).forEach((k) => {
        searchCondition.push({
          field: k,
          operator: 'eq',
          value: tableParams[k],
        });
      });
      // 自定义表格参数合并到表单查询条件
      if (Array.isArray(tableParams)) {
        searchCondition = searchCondition.concat(tableParams);
      }
    }
    // 是否resetPageIndex
    if (resetPageIndex) {
      this.pagination.pageIndex = 1;
    }
    // 由于后端实体类接收，发送前必须确保所有属性都在
    const axiosParams = {
      orderCondition: '',
      searchCondition: [],
      pageIndex: 0,
      pageSize: 0,
    };
    Object.assign(axiosParams, { searchCondition });
    // 合并用于分页的两个参数
    if (showPagination) {
      Object.assign(axiosParams, {
        [pageIndexKey]: pagination.pageIndex,
        [pageSizeKey]: pagination.pageSize,
      });
    }
    // 合并排序参数
    if (this.sortParams.orderCondition !== '') {
      Object.assign(axiosParams, this.sortParams);
    } else if (this.orderCondition) {
      Object.assign(axiosParams, { orderCondition: this.orderCondition });
    }
    // 发起请求
    // eslint-disable-next-line no-nested-ternary
    const requestObject = this.promiseForSelect
      ? this.promiseForSelect(axiosParams, clearParams)
      : this.lazy
        ? crud(DML.TREE_LAZY, this.tableName, axiosParams)
        : crud(DML.SELECT, this.tableName, axiosParams);

    requestObject
      .then((response) => {
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
          result = listField.split('.').reduce((res, key) => res[key], response);
        }
        // 判断拿到的list是否为Array
        if (!result || !Array.isArray(result)) {
          this.loading = false;
          throw new Error(`The result of key:${listField} is not Array.`);
        }
        // 拿到list数据
        this.tableData = result as any;
        // 以下代码 获取该列表总数
        let totalValue = response;
        // 如果返回直接为list,则说明没有分页处理,直接统计length作为总数
        if (Array.isArray(response)) {
          totalValue = response.length;
        } else if (typeof response === 'object') {
          // 此处totalField默认为data.total
          totalValue = totalField.split('.').reduce((res, key) => res[key], response);
        } else {
          totalValue = 0;
        }
        this.total = totalValue;
        this.loading = false;
        if (this.$refs.table) {
          // 获取到数据后清空已选项
          this.$refs.table.clearSelection();
        }
        this.$emit('done', this);
      })
      .catch((e) => {
        this.$notify({
          title: '表格数据请求失败',
          message: `原因：${e.message}`,
          duration: 5000,
        });
        this.loading = false;
      });
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

    crud(DML.TREE_LAZY, this.tableName, data).then((res) => {
      if (resolve) {
        resolve(res.data);
      }
      // 强制更新已渲染子结点
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, tree.id, res.data);
    });
  }

  emitTableEvent(...args) {
    this.$emit(args[0], ...Array.from(args).slice(1));
  }

  /**
   * 排序条件发生变化的时候会触发该事件
   *
   * @param {Object} prop 当前列需要排序的数据
   * @param {Object} order 排序的规则（升序、降序和默认[默认就是没排序]）
   */
  sortChange(args) {
    const { prop, order } = args;
    const fieldOrder = order === 'ascending' ? 'asc' : 'desc';
    this.sortParams.orderCondition = prop ? `${prop} ${fieldOrder}` : '';
    // emit sort-change
    this.$emit('sort-change', args);
    // table reload
    this.dataChangeHandler();
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
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
  .table-title {
    float: left;
    margin-left: 5px;
    h4 {
      margin: 2px 30px 0px 0px;
      padding-left: 15px;
      border-left: 7px solid #007bff;
      font-weight: 500;
      font-size: 20px;
    }
  }
  .btn-bar {
    float: right;
    width: auto;
    text-align: right;
    & > div,
    button {
      float: right;
    }
  }
}
</style>
