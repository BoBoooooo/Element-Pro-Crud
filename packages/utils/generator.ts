/**
 * @file 公共生成器
 * @author BoBo
 * @copyright NanJing Anshare Tech .Com
 * @createDate 2018年11月23日17:41:47
 */

// 允许按位操作符通过eslint检查
/* eslint no-bitwise: ["error", { "allow": ["|","&"] }] */
export default function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}
