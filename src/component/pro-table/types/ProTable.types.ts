/*
 * @file: ProTable prop types
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2020-12-24 10:47:59
 */
import { columns, DataSource, Params, fn, AnyObject } from '@/types/common';

interface ProTableProps {
  searchMode: 'popover' | 'cover';
  visibleList: any;
  tableTitle: string;
  showPagination: boolean;
  remoteFuncs: AnyObject;
  pageSizes: number[];
  paginationLayout: string;
  tableData: any[];
  fullHeight: boolean;
  maxHeightMinus: number;
  showColumnIndex: boolean;
  isMultiple: boolean;
  orderCondition: string;
  tableParams: object | any[];
  selectableFunc: fn;
  columns: columns;
  request: (params: Params) => Promise<DataSource>;
  size: string;
  width: string | number;
  height: string | number;
  maxHeight: string | number;
  fit: boolean;
  stripe: boolean;
  border: boolean;
  rowKey: string | fn;
  context: unknown;
  showHeader: boolean;
  showSummary: boolean;
  sumText: string;
  summaryMethod: fn;
  rowClassName: string | fn;
  rowStyle: unknown | fn;
  cellClassName: string | fn;
  cellStyle: unknown | fn;
  headerRowClassName: string | fn;
  headerRowStyle: unknown | fn;
  headerCellClassName: string | fn;
  headerCellStyle: unknown | fn;
  highlightCurrentRow: boolean;
  currentRowKey: string | number;
  emptyText: string;
  expandRowKeys: any[];
  defaultExpandAll: boolean;
  defaultSort: unknown;
  tooltipEffect: string;
  spanMethod: fn;
  selectOnIndeterminate: boolean;
  indent: number;
  treeProps: any;
  lazy: boolean;
  load: fn;
}

export {
  // eslint-disable-next-line import/prefer-default-export
  ProTableProps,
};
