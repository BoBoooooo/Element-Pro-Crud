/*
 * @file: 工具函数
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2021-01-04 23:37:08
 */
// 判断是否含有中文
// eslint-disable-next-line import/prefer-default-export
export function isChinese(temp) {
  const re = /[^\u4e00-\u9fa5]/;
  if (re.test(temp)) return false;
  return true;
}

// 数组切割
export function chunk(array, size) {
  // 获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
  const { length } = array;
  // 判断不是数组，或者size没有设置，size小于1，就返回空数组
  if (!length || !size || size < 1) {
    return [];
  }
  // 核心部分
  let index = 0; // 用来表示切割元素的范围start
  let resIndex = 0; // 用来递增表示输出数组的下标

  // 根据length和size算出输出数组的长度，并且创建它。
  const result = new Array(Math.ceil(length / size));
  // 进行循环
  while (index < length) {
    // 循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
    result[(resIndex += 1)] = array.slice(index, (index += size));
  }
  // 输出新数组
  return result;
}

/**
 * 防抖函数
 * @param method
 * @param params
 */
export function debounce(method, params) {
  let timer: any = null;
  // eslint-disable-next-line func-names
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      method(params); // 即调用handlerResize，params即传入的参数eleArr
    }, 300);
  };
}

/**
 * 递归获取可查询字段名
 * @param columns columns json
 */
export function diGuiTree() {
  const result:any = [];
  // eslint-disable-next-line no-shadow
  return function getProp(columns) {
    for (const column of columns) {
      if (column.prop && column.searchable) {
        result.push(column);
      }
      if (column.children) {
        getProp(column.children);
      }
    }
    return result;
  };
}
