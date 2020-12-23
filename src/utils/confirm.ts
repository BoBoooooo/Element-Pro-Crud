/*
 * @file: 全局装饰器封装
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年08月19 17:53:46
 */
import { MessageBox } from 'element-ui';

const ElMessageBox = MessageBox;
/**
 * 确认提示框装饰器
 * @param {*} message 提示信息
 * @param {*} title 标题
 * @param {*} cancelFn 取消回调函数
 */
export function confirm(message, title = '提示', cancelFn = (error) => {}) {
  return (target, name, descriptor) => {
    const originFn = descriptor.value;
    // eslint-disable-next-line func-names
    descriptor.value = async function (...rest) {
      try {
        await ElMessageBox.confirm(message, title);
        originFn.apply(this, rest);
      } catch (error) {
        if (cancelFn) {
          cancelFn(error);
        }
      }
    };
  };
}

/**
 * 提示框装饰器
 * @param {*} message 提示信息
 * @param {*} title 提示标题
 */
export function alert(message, title = '提示') {
  return (target, name, descriptor) => {
    const originFn = descriptor.value;
    // eslint-disable-next-line func-names
    descriptor.value = async function (...rest) {
      await ElMessageBox.alert(message, title);
      originFn.apply(this, rest);
    };
  };
}
