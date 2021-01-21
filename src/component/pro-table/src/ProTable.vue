<!--
 * @file: ProTable封装,支持高级查询 分页 增删改查表单
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年09月14 18:01:58
-->

<template>
  <div class="ProTable">
    <div class="base-table">
      <!-- 表格左侧标题 -->
      <div :class="{
        'table-title': searchMode === 'popover',
        'table-title-absolute': searchMode === 'cover'
      }"
           v-if="view.tableTitle && tableTitle">
        <!-- 表格标题 -->
        <h4>{{tableTitle}}</h4>
      </div>
      <!-- table右上角按钮 -->
      <div class="btn-bar"
           v-if="searchMode === 'popover'">
        <slot name="btnBarPrevBtn" />
      </div>
      <SearchForm ref="searchForm"
                  v-if="view.searchForm"
                  :searchMode="searchMode"
                  :showSeniorSearchFormButton="view.seniorSearchBtn"
                  :columns="tableConfig.columns || []"
                  @click="fetchHandler(false,true)"
                  :searchFormCondition.sync="searchFormCondition"
                  :remoteFuncs="remoteFuncs"
                  :isLoading="loading"
                  @clear="dataChangeHandler(true)">
        <template #seniorSearchForm>
          <slot name="seniorSearchForm"></slot>
        </template>
        <template v-if="searchMode === 'cover'">
          <!-- table右上角按钮 -->
          <div class="btn-bar">
            <slot name="btnBarPrevBtn" />
          </div>
        </template>
      </SearchForm>
      <!-- 表格主体 -->
      <el-table v-loading.lock="loading"
                v-bind="$attrs"
                v-on="tableListeners"
                :height="tableHeight"
                :max-height="maxHeight"
                ref="table"
                :row-key="(row)=> row.id"
                :data="tableData">
        <template slot='empty'>
          <SvgIcon icon-class='table_empty'
                   class="empty_icon"></SvgIcon>
          <span>{{this.emptyText}}</span>
        </template>
        <el-table-column v-if="isMultiple"
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
          <!-- 操作列表头插槽 -->
          <template slot="header" slot-scope="scope">
           <slot v-if="$scopedSlots[`${column.prop}_header`]" :name="`${column.prop}_header`"  :column="scope.column"></slot>
           <span v-else>
             {{column.label}}
           </span>
          </template>
         <!-- 插槽情况 -->
          <template slot-scope="scope">
             <!-- 自定义插槽 -->
            <span v-if="column.slotName">
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
      <div class="mt-8">
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
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Emit, Prop, Watch,
} from 'vue-property-decorator';
import { confirm } from '@/utils/confirm';
import SvgIcon from '@/icons/SvgIcon.vue';
import _cloneDeep from 'lodash/cloneDeep';
import { DML, Params, DataSource } from '@/types/common';
import SearchForm from './SearchForm.vue';

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
  DETAIL: 2,
};
@Component({
  name: 'ProTable',
  components: {
    SearchForm,
    SvgIcon,
  },
})
export default class ProTable extends Vue {
  // https://github.com/vuejs/vue-class-component/issues/94
  $refs!: {
    table: HTMLFormElement;
    searchForm: HTMLFormElement;
  };

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

  // 表格结构json
  tableConfig = { columns: [] };

  // 表格数据
  tableData: any[] = [];

  // 查询模式
  @Prop({
    type: String,
    default: 'popover',
  })
  searchMode!: string;

  // 对话框内加载FormDesigner的表名
  @Prop({
    type: String,
    default: null,
  })
  dialogFormDesignerName!: string;

  // 内部元素显示控制
  @Prop({ default: () => ({}), type: Object }) visibleList!: any;

  // 表格标题
  @Prop({
    type: String,
    default: '',
  })
  tableTitle!: string;

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

  // 异步更新表单数据
  @Prop({ default: () => ({}), type: Object }) formValuesAsync!: any;

  // 子表tableConfig 详情看GenerateFormItem中解释
  @Prop({ default: () => ({}), type: Object }) formTableConfig!: any;

  // 操作列宽度
  @Prop({ type: Number, default: null }) actionColumnWidth!: number;

  // 是否需要多选
  @Prop({ default: true, type: Boolean }) isMultiple!: boolean;

  // 排序条件
  @Prop({ default: null, type: String }) orderCondition!: string;

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

  // empty-text
  @Prop({
    type: String,
    default: '暂无数据',
  })
  emptyText!: string;

  // columns列配置
  @Prop({
    type: Object,
    default: null,
    required: true,
  })
  columns!: any;

  // request请求方法
  @Prop({
    type: Function,
    default: null,
    required: true,
  })
  request!: any;

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

  // 内部元素显示控制
  get view() {
    const viewObj = {
      searchForm: true,
      tableTitle: false,
      actionColumn: true,
      seniorSearchBtn: true,
      ...this.visibleList,
    };
    // 操作列是否隐藏
    if (!viewObj.actionColumn) {
      this.tableConfig.columns = this.tableConfig.columns.filter((item: any) => item.slotName !== 'actionColumn');
    }
    return viewObj;
  }

  get tableListeners() {
    return {
      ...this.$listeners,
      'sort-change': this.sortChange,
      'selection-change': this.handleSelectionChange,
    };
  }

  created() {
    // 外侧传入表格json
    if (this.columns) {
      this.tableConfig = this.columns;
    } else {
      this.$message.error('请先设置columns');
    }
  }

  mounted() {
    // 请求数据
    this.fetchHandler(true);
    // 自适应分页组件按钮;
    window.addEventListener('resize', this.resizeHandler);
    console.log(this);
  }


  // 表格刷新
  tableReload() {
    this.dataChangeHandler();
  }

  // 多选事件
  handleSelectionChange(selection) {
    this.$emit('selection-change', selection);
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
      showPagination, pageIndexKey, pageSizeKey, pagination,
    } = this;
    const { tableParams, searchFormCondition } = this;
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
    this.request(axiosParams)
      .then((response: DataSource) => {
        console.log(response);
        const { data = [], total = 0 } = response;
        this.tableData = data;
        this.total = total;
        this.loading = false;
        // 刷新表格清空已勾选项
        if (this.$refs.table) {
          this.$refs.table.clearSelection();
        }
        // 初始化表格高度
        this.setMaxHeight();
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


  @Watch('columns', {
    deep: true,
  })
  columnsOnChange(val) {
    this.tableConfig = val;
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
.ProTable {
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
}
</style>
