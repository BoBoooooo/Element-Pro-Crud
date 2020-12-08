import Vue from 'vue';
import { AxiosPromise } from 'axios';

declare enum DML {
  INSERT = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
  SELECT = 'list',
  TREE = 'tree',
  TREE_LAZY = 'treeByParentID',
  DETAIL = 'detail',
  DELETES = 'deleteByIds',
}

interface optionsType {
  getTables: Function;
  getFormKey: Function;
  getFormDetail: Function;
  getTableDetail: Function;
  crud: (dml: DML, tableName: string, data?: object, params?: object)=> AxiosPromise
}
/** ElementProCrud component common definition */
// eslint-disable-next-line import/prefer-default-export
export declare class BaseComponent extends Vue {
  /** Install component into Vue */
  static install(vue: typeof Vue, options?: optionsType): void;
}
