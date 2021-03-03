/**
 * @file axios config
 * @author BoBo
 * @copyright BoBo
 * @createDate 2018年11月13日10:52:32
 */
import axios from 'axios';
import { Message, MessageBox } from 'element-ui'; // eslint-disable-line
// axios详细配置参考：
// https://github.com/axios/axios#request-config

const ElMessageBox = MessageBox;
const ElMessage = Message;
// 创建axios实例
const service = axios.create({
  baseURL: window.__HOST__URL__ + window.__PREFIX__URL__, // 后端接口根路径
  timeout: 60 * 1000, // 请求超时时间
});

// 拦截请求
service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    // 请求出错
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    Promise.reject(error);
  },
);

// 拦截响应
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // let { data } = res;
    const { message, code } = res;
    // 600表示token异常需要重新登录
    if (code === 600) {
      ElMessage({
        message: 'token已过期',
        type: 'error',
        duration: 1000,
      });
      window.location.reload(); // 为了重新实例化vue-router对象，避免bug
    } else if (code === 500) {
      // 极端情况服务器错误
      ElMessageBox.alert(`状态码：500<br>接口：${response.request.responseURL}<br>原因：${message}`, '请截图并联系运维人员', {
        confirmButtonText: '我知道了',
        type: 'warning',
        dangerouslyUseHTMLString: true,
        customClass: 'msgBox',
        showClose: true,
      });
    } else if (code === 400) {
      // 业务失败情况统一拦截
      ElMessageBox.alert(`原因：${message}`, '操作失败', {
        confirmButtonText: '我知道了',
        type: 'warning',
        showClose: true,
      });
    }
    // 正常响应继续传递
    return res;
  },
  (error) => {
    // http状态码200以外的情况
    // 请检查网络链接或联系管理员
    const msg = '请检查网络链接或联系管理员。';
    ElMessageBox.alert(error.response.data.message, '服务器异常', {
      confirmButtonText: '重试',
      type: 'warning',
    }).then(() => {
      // 清空token
      window.location.reload(); // 为了重新实例化vue-router对象，避免bug
    });

    return Promise.reject(error);
  },
);

export default service;
