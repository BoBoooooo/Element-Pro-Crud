/*
 * @file: ProTable prop types
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2020-12-24 10:47:59
 */
import {
  columns, DataSource, Params, fn, AnyObject,
} from '@/types/common';


interface CrudTableProps {
    searchMode: 'popover' | 'cover'
    visibleList: any
    tableTitle: string
    showPagination: boolean
    remoteFuncs: AnyObject
    pageSizes: number[]
    paginationLayout: string
    tableData: any[]
    fullHeight: boolean
    maxHeightMinus: number
    showColumnIndex: boolean
    isMultiple: boolean
    orderCondition: string
    tableParams: object | any[]
    selectableFunc: fn
    columns: columns
    request: (params: Params) => Promise<DataSource>
    size: string
    width: string | number
    height: string | number
    maxHeight: string | number
    fit: boolean
    stripe: boolean
    border: boolean
    rowKey: string | fn
    context: unknown
    showHeader: boolean
    showSummary: boolean
    sumText: string
    summaryMethod: fn
    rowClassName: string | fn
    rowStyle: unknown | fn
    cellClassName: string | fn
    cellStyle: unknown | fn
    headerRowClassName: string | fn
    headerRowStyle: unknown | fn
    headerCellClassName: string | fn
    headerCellStyle: unknown | fn
    highlightCurrentRow: boolean
    currentRowKey: string | number
    emptyText: string
    expandRowKeys: any[]
    defaultExpandAll: boolean
    defaultSort: unknown
    tooltipEffect: string
    spanMethod: fn
    selectOnIndeterminate: boolean
    indent: number
    // treeProps: any
    lazy: boolean
    // load: fn,
    // CrudTable相关props
    listField: string // 数据源
    readOnly: boolean // 是否只读
    prefill:AnyObject // 添加对话框预填项
    dialogAppendToBody: boolean // 弹出表单appendToBody
    dialogWidth: boolean // 弹出表单width
    tableDesignerName: string // 用于请求表格设计json的name
    dialogFormDesignerName: string // 对话框内加载FormDesigner的表名
    tableName : string // 表名
    textMap: AnyObject // 界面元素名称
    promiseForDel: fn // 删除按钮方法代理
    promiseForDels: fn // 批量删除按钮方法代理
    promiseForDetail: fn // 查看按钮方法代理
    promiseForSave: fn // 代理保存方法
    promiseForSelect: fn // 请求数据方法代理
    btnDelVisibleFunc: fn // 删除按钮是否可见代理
    btnEditVisibleFunc: fn // 编辑按钮是否可见代理
    btnAddVisibleFunc: fn // 表格行中的添加按钮是否显示事件
    btnDetailVisibleFunc: fn // 查看按钮是否可见代理
    btnAddOnClick: fn // 表格添加按钮点击事件
    btnEditOnClick: fn // 表格行中的编辑按钮点击事件
    btnDetailOnClick: fn // 表格行中的查看按钮点击事件
    btnRowAddOnClick: fn // 表格行中的添加按钮点击事件
    dialogCloseOnClickModal: boolean // 点击阴影弹框是否可以关闭
    dialogFullscreen: boolean // 表单是否全屏
    formValuesAsync: AnyObject // 异步更新表单数据
    formTableConfig: AnyObject // 子表tableConfig
    actionColumnWidth: number // 操作列宽度
    totalField: string // totalField
  }

export {
  // eslint-disable-next-line import/prefer-default-export
  CrudTableProps,
};
