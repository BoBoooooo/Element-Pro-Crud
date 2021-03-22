<!--
 * @file: ProTable 基于el-table封装,托管高级查询、分页、表格
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年09月14 18:01:58
-->
<template>
  <div class="ProTable">
    <!-- 表格左侧标题 -->
    <div
      :class="{
        'table-title-container': searchMode === 'popover',
        'table-title-container-absolute': searchMode === 'cover',
      }"
      v-if="view.tableTitle && tableTitle"
    >
      <!-- 表格标题 -->
      <h4 class="title">{{ tableTitle }}</h4>
    </div>
    <!-- table右上角按钮 -->
    <div class="btn-bar"
    :class="{
      'btn-bar-absolute': searchMode === 'cover'
    }">
      <slot name="btnBarPrevBtn" />
    </div>
    <SearchForm
      ref="searchForm"
      v-if="view.searchForm"
      :searchMode="searchMode"
      :showSeniorSearchFormButton="view.seniorSearchBtn"
      :columns="tableConfig.columns || []"
      @click="fetchHandler(false, true)"
      :searchFormCondition.sync="searchFormCondition"
      :remoteFuncs="remoteFuncs"
      :isLoading="loading"
      @clear="fetchHandler(true)"
    >
    </SearchForm>
    <!-- 表格主体 -->
    <el-table v-loading.lock="loading" v-bind="$attrs" v-on="tableListeners" :height="tableHeight" :max-height="maxHeight" ref="tableRefs" :row-key="rowKey" :data="tableData">
      <template slot="append">
        <slot name="append"></slot>
      </template>
      <template slot="empty">
        <SvgIcon icon-class="table_empty" class="empty_icon"></SvgIcon>
        <span>{{ emptyText }}</span>
      </template>
      <el-table-column v-if="isMultiple" type="selection" reserve-selection align="center" header-align="center" width="55" :selectable="selectableFunc"> </el-table-column>
      <el-table-column v-if="showColumnIndex" type="index" align="center" label="#" header-align="center" width="50"> </el-table-column>
      <!-- el-table-column单独封装,便于支持多级表头 -->
      <Column :column="column" :key="columnIndex" v-for="(column, columnIndex) in tableConfig.columns">
         <!-- 表格插槽 -->
        <template :slot="slotName" slot-scope="scope"  v-for="(slotName) in Object.keys($scopedSlots)">
          <slot :name="slotName"  :column="scope.column" :row="scope.row" :prop="scope.prop"></slot>
        </template>
      </Column>
    </el-table>
    <!-- 分页 -->
    <div class="mt-8">
      <el-pagination
        v-if="showPagination"
        :current-page="pagination.pageIndex"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :pager-count="pagerCount"
        :small="pagerSmall"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="float: right"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SvgIcon from '@/icons/SvgIcon.vue';

import VueCompositionApi, {
  reactive, computed, ref, defineComponent, onBeforeUnmount, onMounted, Ref, watch, PropType, nextTick,
} from '@vue/composition-api';
import {
  columnConfig, columns, Condition, DataSource, Params,
} from '@/types/common';
import { Notification } from 'element-ui';
import { ElTable } from 'element-ui/types/table';
import SearchForm from './SearchForm.vue';
import { ProTableProps } from '../types/ProTable.types';
import Column from './Column.vue';

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
  DETAIL: 2,
};

Vue.use(VueCompositionApi);

export default defineComponent({
  name: 'ProTable',
  components: {
    SearchForm,
    SvgIcon,
    Column,
  },
  props: {
    // 查询模式
    searchMode: {
      type: String,
      default: 'popover',
    },
    visibleList: {
      default: () => ({}),
      type: Object,
    },
    tableTitle: {
      type: String,
      default: '',
    },
    showPagination: {
      default: true,
      type: Boolean,
    },
    // 远程数据方法
    remoteFuncs: {
      default: () => ({}),
      type: Object,
    },
    // 页码大小
    pageSizes: {
      default: () => [20, 50, 100],
      type: Array,
    },
    // 分页显示
    paginationLayout: {
      type: String,
      default: 'total, prev, pager, next, jumper, sizes',
    },
    // 是否自适应屏幕高度
    fullHeight: {
      type: Boolean,
      default: false,
    },
    // 高度minus
    maxHeightMinus: {
      type: Number,
      default: 270,
    },
    // el-table height
    height: {
      type: Number,
    },
    // 是否显示序号列
    showColumnIndex: {
      default: false,
      type: Boolean,
    },
    // 是否需要多选
    isMultiple: {
      default: true,
      type: Boolean,
    },
    // 排序条件
    orderCondition: {
      default: null,
      type: String,
    },
    // tableParams 预设查询参数
    tableParams: {
      type: [Object, Array],
      default: () => ({}),
    },
    // 选择行是否可选
    selectableFunc: {
      default: null,
      type: Function,
    },
    // empty-text
    emptyText: {
      type: String,
      default: '暂无数据',
    },
    // columns列配置
    columns: {
      type: Object as PropType<columns>,
      default: () => ({}),
      required: true,
    },
    // request请求方法
    request: {
      type: Function as PropType<(params: Params) => Promise<DataSource>>,
      default: null,
      required: true,
    },
    rowKey: {
      type: Function,
      default: row => row.id,
    },
  },
  emits: ['done', 'selection-change'],
  setup(props: ProTableProps, {
    listeners, emit, attrs, root, slots,
  }) {
    // 表格数据总数
    const total = ref(0);
    // 是否在加载
    const loading = ref(false);
    const sortParams = reactive({
      orderCondition: '',
    });
    // 最大页码按钮数
    const pagerCount = ref(7);
    // 是否显示小型分页
    const pagerSmall = ref(false);
    // 高级查询Condition
    const searchFormCondition = ref<Condition[]>([]);
    // 表格最大高度
    const maxHeight = ref('100%');
    // 表格高度
    const tableHeight = ref<string | number>('100%');
    // 表格结构json
    const _config = props.columns ? props.columns : { columns: [], name: '', position: '' };
    const tableConfig = reactive(_config);
    // 表格数据
    const tableData = ref<any>([]);
    // table refs
    const tableRefs: Ref<ElTable | null> = ref(null);
    // 分页页码
    const pagination = computed(() => ({
      pageIndex: 1,
      pageSize: ((): number => {
        if (props.pageSizes.length > 0) {
          return props.pageSizes[0];
        }
        return 20;
      })(),
    }));
    // 内部元素显示控制
    const view = computed(() => {
      const viewObj = {
        searchForm: true,
        tableTitle: true,
        actionColumn: true,
        seniorSearchBtn: true,
        ...props.visibleList,
      };
      // 操作列是否隐藏
      if (!viewObj.actionColumn) {
        tableConfig.columns = tableConfig.columns.filter((_: columnConfig) => _.slotName !== 'actionColumn');
      }
      return viewObj;
    });
    const setMaxHeight = () => {
      const h = document.documentElement.clientHeight || document.body.clientHeight;
      maxHeight.value = `${Math.max(0, h - props.maxHeightMinus)}px`;
      tableHeight.value = props.fullHeight ? maxHeight.value : props.height;
    };

    // 根据表格宽度自动调整分页栏大小
    const setPagerByWidth = () => {
      if (tableRefs.value && tableRefs.value.$el.clientWidth < 655) {
        pagerCount.value = 5;
        pagerSmall.value = true;
      } else {
        pagerCount.value = 7;
        pagerSmall.value = false;
      }
    };
    const resizeHandler = () => {
      setPagerByWidth();
      setMaxHeight();
    };
    const fetchHandler = (clearParams = false, resetPageIndex = false) => {
      let searchCondition: Condition[] = [];
      loading.value = true;
      // 如清空查询条件,则清空
      if (clearParams) {
        searchCondition = [];
      } else {
        searchCondition = searchCondition.concat(searchFormCondition.value);
      }
      const { tableParams, orderCondition, showPagination } = props;
      // 此处为外部传入的tableParams,不做清空处理!
      if (tableParams) {
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
        pagination.value.pageIndex = 1;
      }
      // 由于后端实体类接收，发送前必须确保所有属性都在
      const axiosParams: Params = {
        orderCondition: '',
        searchCondition: [],
        pageIndex: 0,
        pageSize: 0,
      };
      Object.assign(axiosParams, { searchCondition });
      // 合并用于分页的两个参数
      if (showPagination) {
        Object.assign(axiosParams, {
          pageIndex: pagination.value.pageIndex,
          pageSize: pagination.value.pageSize,
        });
      }
      // 合并排序参数
      if (sortParams.orderCondition !== '') {
        Object.assign(axiosParams, sortParams);
      } else if (orderCondition) {
        Object.assign(axiosParams, { orderCondition });
      }
      props
        .request(axiosParams)
        .then((response) => {
          const { data = [], total: count = 0 } = response;
          tableData.value = data;
          total.value = count;
          loading.value = false;
          // 刷新表格清空已勾选项
          if (tableRefs.value) {
            tableRefs.value.clearSelection();
          }
          setTimeout(() => {
            setMaxHeight();
            nextTick(() => {
              tableRefs.value!.doLayout();
            });
          }, 300);
          emit('done', {
            total: count,
            data,
          });
        })
        .catch((e) => {
          Notification({
            title: '表格数据请求失败',
            message: `原因：${e.message}`,
            duration: 5000,
          });
          loading.value = false;
        });
    };

    /**
     * 排序条件发生变化的时候会触发该事件
     *
     * @param {Object} prop 当前列需要排序的数据
     * @param {Object} order 排序的规则（升序、降序和默认[默认就是没排序]）
     */
    const sortChange = (args) => {
      const { prop, order } = args;
      const fieldOrder = order === 'ascending' ? 'asc' : 'desc';
      sortParams.orderCondition = prop ? `${prop} ${fieldOrder}` : '';
      // emit sort-change
      emit('sort-change', args);
      // table reload
      fetchHandler();
    };

    // 多选事件
    const handleSelectionChange = (selection) => {
      emit('selection-change', selection);
    };

    const tableListeners = computed(() => ({
      ...listeners,
      'sort-change': sortChange,
      'selection-change': handleSelectionChange,
    }));

    // 表格刷新
    const tableReload = () => {
      fetchHandler();
    };

    // pageSize改变事件
    const handleSizeChange = (size) => {
      pagination.value.pageSize = size;
      fetchHandler();
    };

    // pageIndex改变事件
    const handleCurrentChange = (pageIndex) => {
      pagination.value.pageIndex = pageIndex;
      fetchHandler();
    };

    onMounted(() => {
      // 请求数据
      fetchHandler(true);
      // 自适应分页组件按钮;
      window.addEventListener('resize', resizeHandler);
      console.log(slots);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandler);
    });

    // 监听
    watch(
      () => props.columns,
      (val) => {
        // 此处语法待优化
        // eslint-disable-next-line no-shadow
        const { columns, name, position } = val;
        tableConfig.columns = columns;
        tableConfig.name = name;
        tableConfig.position = position;
      },
    );

    return {
      total,
      view,
      tableData,
      tableRefs,
      tableConfig,
      loading,
      attrs,
      listeners,
      tableHeight,
      maxHeight,
      pagination,
      pagerCount,
      pagerSmall,
      handleSizeChange,
      fetchHandler,
      handleCurrentChange,
      tableListeners,
      searchFormCondition,
      tableReload,
    };
  },
});
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.ProTable {
  background: white;
  padding: 10px;
  position: relative;
  /deep/ {
    .el-table__empty-text {
      line-height: 10px;
      margin-bottom: 15px;
      color: rgba(0, 0, 0, 0.25) !important;
      font-size: 14px;
    }
    .empty_icon {
      width: 4em;
      height: 4em;
      display: block;
      margin: 0 auto;
    }
    .title {
      margin: 2px 30px 0px 0px;
      padding-left: 15px;
      font-weight: 500;
      font-size: 18px;
    }
    .table-title-container {
      float: left;
      margin-left: 5px;
    }
    .table-title-container-absolute {
      position: absolute;
      top: 130px;
      left: 10px;
    }
    .btn-bar-absolute{
      float:none !important;
      top: 132px;
      right: 175px;
      width: auto;
      position: absolute;
      text-align: right;
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
}
</style>
