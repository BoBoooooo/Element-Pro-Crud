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
      <ProTable
        v-bind="$attrs"
        v-on="$listeners"
        ref="proTableRef"
        :rowKey="rowKey"
        @selection-change="handleSelectionChange"
        :visibleList="view"
        :columns="tableConfig"
        :request="request"
        :tableParams="tableParams"
        :lazy="lazy"
        :load="treeload"
        :tree-props="{ children: 'children', hasChildren: 'flag' }"
      >
        <template #append>
          <slot name="append"></slot>
        </template>
        <template #btnBarPrevBtn>
          <!-- 批量删除按钮 -->
          <el-button v-if="view.btnDel" @click="btnDeletesOnClick" type="danger" size="mini" icon="el-icon-delete">{{ text.multiDel }}</el-button>
          <!-- 添加按钮 -->
          <el-button v-if="view.btnAdd" type="primary" icon="el-icon-plus" size="mini" @click.stop="btnAdd()">{{ text.add }}</el-button>
        </template>
        <!-- 列表头添加按钮 -->
        <template #_action_header v-if="view.btnAddOnColumnHeader">
          <el-button icon="el-icon-plus" size="mini" type="primary" style="color:white" @click.stop="btnAdd"></el-button>
        </template>
        <template #columnFormatter="{row,prop}">
          <slot name="columnFormatter" :row="row" :prop="prop"></slot>
        </template>
        <template slot-scope="scope" slot="actionColumn">
          <!-- 操作列-添加按钮 -->
          <el-button v-if="view.actionColumnBtnAdd" icon="el-icon-plus" type="primary" size="mini" @click.stop="actionColumnAdd(scope.row)">{{ text.add }}</el-button>
          <!-- 操作列-编辑按钮 -->
          <template v-if="actionColumnBtnEditVisible(scope.row)">
            <el-button type="success" size="mini" @click.stop="actionColumnEdit(scope.row)">{{ text.edit }}</el-button>
          </template>
          <!-- 操作列-查看按钮 -->
          <el-button v-if="actionColumnBtnDetailVisible(scope.row)" type="primary" size="mini" @click.stop="actionColumnDetail(scope.row)">{{ text.detail }}</el-button>

          <!-- 操作列-删除按钮 -->
          <el-button v-if="actionColumnBtnDelVisible(scope.row)" type="danger" size="mini" @click.stop="actionColumnDel(scope.row)">{{ text.del }}</el-button>
          <!-- 自定义按钮 -->
          <slot name="btnCustom" :row="scope.row" />
        </template>
      </ProTable>
      <!-- 新增、编辑、查看按钮 弹出 表单-->
      <GenerateFormDialog
        ref="dialogRef"
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
        :width="dialogWidth"
        @btnOnClick="formBtnOnClick"
      >
        <template #dialogFooter>
          <slot name="dialogFooter"></slot>
        </template>
      </GenerateFormDialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _cloneDeep from 'lodash/cloneDeep';
import {
  columns, DataSource, DML, Params,
} from '@/types/common';
import VueCompositionApi, {
  reactive, computed, ref, defineComponent, Ref, watch,
} from '@vue/composition-api';
import { Message, MessageBox } from 'element-ui';
import GenerateFormDialog from './GenerateFormDialog.vue';
import ProTable from '../../pro-table';
import { CrudTableProps } from '../types/CrudTable.types';

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
  DETAIL: 2,
};

Vue.use(VueCompositionApi);

export default defineComponent({
  name: 'CrudTable',
  components: {
    GenerateFormDialog,
    ProTable,
  },
  props: {
    listField: {
      type: String,
      default: 'data.list',
    },
    rowKey: {
      type: Function,
      default: row => row.id,
    },
    readOnly: {
      default: false,
      type: Boolean,
    },
    prefill: {
      default: null,
      type: Object,
    },
    dialogAppendToBody: {
      default: true,
      type: Boolean,
    },
    dialogWidth: {
      default: '80%',
      type: String,
    },
    tableDesignerName: {
      type: String,
      default: null,
    },
    dialogFormDesignerName: {
      type: String,
      default: null,
    },
    visibleList: {
      default: () => ({}),
      type: Object,
    },
    tableName: {
      type: String,
      default: '',
    },
    textMap: {
      default: () => ({}),
      type: Object,
    },
    promiseForSelect: {
      default: null,
      type: Function,
    },
    promiseForDel: {
      default: null,
      type: Function,
    },
    promiseForDels: {
      default: null,
      type: Function,
    },
    promiseForDetail: {
      default: null,
      type: Function,
    },
    promiseForSave: {
      default: null,
      type: Function,
    },
    btnDelVisibleFunc: {
      default: null,
      type: Function,
    },
    btnEditVisibleFunc: {
      default: null,
      type: Function,
    },
    btnAddVisibleFunc: {
      default: null,
      type: Function,
    },
    btnDetailVisibleFunc: {
      default: null,
      type: Function,
    },
    btnAddOnClick: {
      default: null,
      type: Function,
    },
    btnEditOnClick: {
      default: null,
      type: Function,
    },
    btnDetailOnClick: {
      default: null,
      type: Function,
    },
    btnRowAddOnClick: {
      default: null,
      type: Function,
    },
    remoteFuncs: {
      default: () => ({}),
      type: Object,
    },
    dialogCloseOnClickModal: {
      default: true,
      type: Boolean,
    },
    dialogFullscreen: {
      default: false,
      type: Boolean,
    },
    formValuesAsync: {
      default: () => ({}),
      type: Object,
    },
    formTableConfig: {
      default: () => ({}),
      type: Object,
    },
    actionColumnWidth: {
      type: Number,
      default: null,
    },
    totalField: {
      type: String,
      default: 'data.total',
    },
    tableParams: {
      type: [Object, Array],
      default: () => ({}),
    },
    lazy: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['form-btn-on-click', 'form-change', 'selection-change'],
  setup(props: CrudTableProps, {
    listeners, attrs, emit, root,
  }) {
    const { $PROCRUD } = root;

    // 当前行
    let currentRow = reactive<any>({});
    // 已选择行
    const selectedRows = ref<any>([]);
    // tableJson
    const tableConfig = reactive<columns>({ columns: [], name: '', position: '' });

    const proTableRef: Ref<any> = ref(null);
    const dialogRef: Ref<any> = ref(null);

    // 文本映射
    const text = computed(() => ({
      add: '添加',
      edit: '编辑',
      del: '删除',
      detail: '查看',
      multiDel: '批量删除',
      ...props.textMap,
    }));

    const view = computed(() => {
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
        ...props.visibleList,
      };
      // 只读模式隐藏添加编辑删除按钮
      if (props.readOnly) {
        viewObj.btnAdd = false;
        viewObj.btnDel = false;
        viewObj.btnAddOnColumnHeader = false;
        viewObj.actionColumnBtnDel = false;
        viewObj.actionColumnBtnEdit = false;
        viewObj.actionColumnBtnDetail = true;
      }
      // 操作列是否隐藏
      if (!viewObj.actionColumn) {
        tableConfig.columns = tableConfig.columns.filter((item: any) => item.slotName !== 'actionColumn');
      }

      return viewObj;
    });

    // 表格刷新
    const tableReload = () => {
      proTableRef.value.tableReload();
    };

    // 初始化表格json
    const promise = $PROCRUD.getTableDetail(props.tableDesignerName ? props.tableDesignerName : props.tableName);
    // 加载表格结构
    promise.then((res) => {
      const _tableConfig = JSON.parse(res.data.formJson);
      // eslint-disable-next-line no-shadow
      const { columns, name, position } = _tableConfig;
      tableConfig.columns = columns;
      tableConfig.name = name;
      tableConfig.position = position;
      // 如果显示指明了操作列列宽
      if (props.actionColumnWidth) {
        const actionColumn = tableConfig.columns.find(_ => _.slotName === 'actionColumn');
        if (actionColumn) {
          actionColumn.width = props.actionColumnWidth;
          actionColumn.minWidth = props.actionColumnWidth;
        }
      }
    });

    // 懒加载
    const treeload = (tree, treeNode?: any, resolve?: any) => {
      const data = {
        searchCondition: [
          {
            field: 'parentid',
            operator: 'eq',
            value: tree.id,
          },
        ],
      };

      $PROCRUD.crud(DML.TREE_LAZY, props.tableName, data).then((res) => {
        if (resolve) {
          resolve(res.data);
        }
        // 强制更新已渲染子结点
        proTableRef.value.$refs.tableRefs.store.states.lazyTreeNodeMap[tree.id] = res.data;
      });
    };
    // CRUD请求封装
    const request = async (axiosParams: Params): Promise<DataSource | undefined> => {
      // 已加载完成, tree lazy table 局部刷新.
      // 懒加载待重构
      if (props.lazy) {
        treeload({
          id: currentRow.parentid,
        });
        return;
      }
      // 发起请求
      // eslint-disable-next-line no-nested-ternary
      const requestObject = props.promiseForSelect
        ? props.promiseForSelect(axiosParams)
        : props.lazy
          ? $PROCRUD.crud(DML.TREE_LAZY, props.tableName, axiosParams)
          : $PROCRUD.crud(DML.SELECT, props.tableName, axiosParams);

      const response = await requestObject;
      let result = response;
      if (response && !Array.isArray(response)) {
        // 此处listField默认为 data.list
        result = props.listField.split('.').reduce((res, key) => res[key], response);
      }
      // 判断拿到的list是否为Array
      if (!result || !Array.isArray(result)) {
        throw new Error(`The result of key:${props.listField} is not Array.`);
      }
      let totalValue = response;
      // 如果返回直接为list,则说明没有分页处理,直接统计length作为总数
      if (Array.isArray(response)) {
        totalValue = response.length;
      } else if (typeof response === 'object') {
        // 此处totalField默认为data.total
        totalValue = props.totalField.split('.').reduce((res, key) => res[key], response);
      } else {
        totalValue = 0;
      }
      // 返回数据集合以及总数
      // eslint-disable-next-line consistent-return
      return {
        total: totalValue,
        data: result,
      };
    };

    const ElMessage = Message;
    const ElMessageBox = MessageBox;

    // 增删改查按钮方法定义
    const handlerButtonMethods = {
      // 添加
      btnAdd() {
        if (props.btnAddOnClick) {
          props.btnAddOnClick();
        } else if (props.prefill) {
          // 对话框内加载预填项
          dialogRef.value.showDialog({}, 0, props.prefill);
        } else {
          dialogRef.value.showDialog();
        }
      },

      // 操作列-添加
      actionColumnAdd(row) {
        // 添加成功后需要刷新当前结点的子节点,此处特殊处理
        currentRow.parentid = _cloneDeep(row).id;
        if (props.btnRowAddOnClick) {
          props.btnRowAddOnClick(row);
        } else if (props.prefill) {
          // 对话框内加载预填项
          // 此处跟正常情况的preFill不一样
          // 此处传的为Array
          // 用于tree接口点添加自动赋值parentid的情况
          // 例如传 { parentid : id} 则表示添加的parentid = row.id
          const obj = {};
          Object.keys(props.prefill).forEach((key) => {
            obj[key] = row[props.prefill[key]];
          });
          dialogRef.value.showDialog({}, 0, obj);
        } else {
          dialogRef.value.showDialog();
        }
      },

      // 操作列-编辑
      actionColumnEdit(row) {
        currentRow = reactive(row);
        if (props.btnEditOnClick) {
          props.btnEditOnClick(row);
        } else {
          const promiseForDetail = props.promiseForDetail
            ? props.promiseForDetail(row.id)
            : $PROCRUD.crud(
              DML.DETAIL,
              props.tableName,
              {},
              {
                id: row.id,
              },
            );
          // 请求后台detail接口获取表单数据
          promiseForDetail.then((res) => {
            dialogRef.value.showDialog({ id: row.id }, STATUS.UPDATE, res.data);
          });
        }
      },

      // 操作列-查看
      actionColumnDetail(row) {
        currentRow = row;
        if (props.btnDetailOnClick) {
          props.btnDetailOnClick(row);
        } else {
          const promiseForDetail = props.promiseForDetail
            ? props.promiseForDetail(row.id)
            : $PROCRUD.crud(
              DML.DETAIL,
              props.tableName,
              {},
              {
                id: row.id,
              },
            );
          // 请求后台detail接口获取表单数据
          promiseForDetail.then((res) => {
            dialogRef.value.showDialog({ id: row.id }, STATUS.DETAIL, res.data);
          });
        }
      },

      handleSelectionChange(selection) {
        selectedRows.value = selection;
        emit('selection-change', selection);
      },

      // 批量删除按钮
      btnDeletesOnClick() {
        const { length } = selectedRows.value || [];
        if (length > 0) {
          ElMessageBox.confirm(`已选中${length}项,确认删除？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              const promiseForDels = props.promiseForDels
                ? props.promiseForDels(selectedRows.value.map(item => item.id))
                : $PROCRUD.crud(
                  DML.DELETES,
                  props.tableName,
                  selectedRows.value.map(item => item.id),
                );
              promiseForDels.then(() => {
                tableReload();
                ElMessage.success('批量删除成功');
              });
            })
            .catch(() => {
              ElMessage.info('已取消删除');
            });
        } else {
          console.log(ElMessage);

          ElMessage('请先选择删除项');
        }
      },

      // 操作列-删除
      actionColumnDel(row) {
        ElMessageBox.confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            currentRow = row;
            // 如果prop传入了promiseForDel说明需要回调自定义删除
            const promiseForDel = props.promiseForDel ? props.promiseForDel(row.id) : $PROCRUD.crud(DML.DELETE, props.tableName, {}, { id: row.id });
            promiseForDel.then(() => {
              tableReload();
              ElMessage({
                type: 'success',
                message: '删除成功',
              });
            });
          })
          .catch(() => {
            ElMessage.info('已取消删除');
          });
      },

      // 操作列-添加按钮是否显示
      actionColumnBtnAddVisible(row) {
        let visible;
        if (props.btnAddVisibleFunc) {
          // 如果传入了计算函数，取函数结果
          visible = props.btnAddVisibleFunc(row);
        } else {
          // 默认不显示
          visible = view.value.actionColumnBtnAdd;
        }
        return visible;
      },

      // 操作列-编辑按钮是否显示
      actionColumnBtnEditVisible(row) {
        let visible;
        if (props.btnEditVisibleFunc) {
          // 如果传入了计算函数，取函数结果
          visible = props.btnEditVisibleFunc(row);
        } else {
          // 默认不显示
          visible = view.value.actionColumnBtnEdit;
        }
        return visible;
      },

      // 操作列-详情按钮是否显示
      actionColumnBtnDetailVisible(row) {
        let visible;
        // 如果传入了计算函数，取函数结果
        if (props.btnDetailVisibleFunc) {
          visible = props.btnDetailVisibleFunc(row);
        } else {
          // 默认不显示
          visible = view.value.actionColumnBtnDetail;
        }
        return visible;
      },

      // 操作列-删除按钮是否显示
      actionColumnBtnDelVisible(row) {
        let visible;
        if (props.btnDelVisibleFunc) {
          // 如果传入了计算函数，取函数结果
          visible = props.btnDelVisibleFunc(row);
        } else {
          // 默认显示
          visible = view.value.actionColumnBtnDel;
        }
        return visible;
      },

      // 生成的按钮点击
      formBtnOnClick(widget) {
        emit('form-btn-on-click', widget);
      },

      // 监听dialog中form对象改变
      formChange(val) {
        emit('form-change', val);
      },
    };
    return {
      tableReload,
      ...handlerButtonMethods,
      currentRow,
      selectedRows,
      tableConfig,
      proTableRef,
      dialogRef,
      view,
      text,
      request,
      treeload,
    };
  },
});
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
  width: 100%;
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
