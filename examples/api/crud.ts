/*
 * @file: 通用请求crud
          可根据后台接口情况自行修改
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年04月24 11:35:00
 */

import axios from './axios';

interface optionsType {
  url: string; // 请求地址
  method: string; // 请求方法 post / get
  data?: object; // body报体内容
  params?: object; // queryString内容
  headers?: any; // 自定义头,用于设置是否加密请求
}

/**
 * 操作类型枚举
 */
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

/**
 *
 * @param dml 操作类型
 * @param tableName 数据库表名
 * @param data body data
 * @param params query Params
 */
export function crud(dml: DML, tableName: string, data: object = {}, params: any = null) {
  const options: optionsType = {
    url: `/${tableName}/${dml}`, // 例如users表的查询接口为  /users/list
    method: 'post',
  };
  // 以下请求通过包体传参
  if ('list,treeByParentID'.includes(dml)) {
    // list接口高级查询条件拼接
    options.data = {
      orderCondition: '',
      searchCondition: [],
      pageIndex: 0,
      pageSize: 0,
      ...data,
    };
  } else {
    options.data = data;
  }
  options.params = params;

  return axios(options as any);
}
