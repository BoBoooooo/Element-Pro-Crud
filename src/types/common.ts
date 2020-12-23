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
