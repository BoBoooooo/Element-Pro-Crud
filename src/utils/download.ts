/**
 * @file 文件下载
 * @author ytyang
 * @copyright BoBo
 * @createDate 2018年11月18日08:13:10
 */
import Vue from 'vue';

/**
 * 通用下载
 *
 * @export
 * @param {String} url 请求地址
 * @param {String} name 文件名
 * @param {Object} params 请求参数
 * @param {String} requestType 请求方式(get,post)
 */
export default function (url, name, params, requestType = 'get') {
  let axiosObj;
  if (requestType === 'get') {
    axiosObj = Vue.prototype.$PROCRUD.axios.get(url, { responseType: 'blob', params });
  } else {
    axiosObj = Vue.prototype.$PROCRUD.axios.post(url, params, { responseType: 'blob' });
  }
  axiosObj.then((res) => {
    if (!res) {
      return;
    }
    const blob = new Blob([res]);
    const date = new Date();
    let fileName;
    if (/^.*\..{1,4}$/.test(name)) {
      fileName = name;
    } else {
      fileName = `${name} ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒.xls`;
    }
    const aTag = document.createElement('a');
    aTag.style.display = 'none';
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    document.body.appendChild(aTag);
    aTag.click();
    URL.revokeObjectURL(aTag.href);
    document.body.removeChild(aTag);
  });
}
