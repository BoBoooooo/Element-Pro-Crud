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
