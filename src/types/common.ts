/*
 * @file: DML枚举
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020-12-08 11:33:34
 */
// eslint-disable-next-line import/prefer-default-export
export enum DML {
  INSERT = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
  SELECT = 'list',
  TREE = 'tree',
  TREE_LAZY = 'treeByParentID',
  DETAIL = 'detail',
  DELETES = 'deleteByIds',
}

export interface Condition {
  field: string;
  operator?: string;
  value: any;
}

export interface Params {
  orderCondition: string;
  searchCondition: Array<Condition>;
  pageIndex: number;
  pageSize: number;
}
export interface DataSource {
  data: any[];
  total: number;
}

export interface columns {
  name: string; // 表格json名称
  position: string; // 使用位置
  columns: Array<columnConfig>; // 列配置
}

export interface columnConfig {
  prop: string; // 字段名
  label: string; // 表头
  width?: number; // 宽度
  minWidth: number; // 最小宽度
  align: boolean; // 内容对齐方式
  headerAlign: boolean; // 表头对齐方式
  slotName: string; // 自定义插槽名
  fixed: string; // 列对齐方式
  sortable: 'false' | 'custom'; // 是否可排序
  searchable: boolean; // 是否可查询
  option?: AnyObject; // 高级查询选项
}

export interface fn {
  (...args: any[]): any;
}

export interface AnyObject {
  [key: string]: any;
}

export interface searchParamsEntity {
  field: string; // 字段名
  operator: string; // 操作符
  value: string | number | boolean; // 值
  label?: string | null | undefined; // 中文名
}
