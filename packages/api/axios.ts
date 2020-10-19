/**
 * @file 封装原生axios，在main.js和api层引用本文件
 * @author ytyang
 * @copyright NanJing Anshare Tech .Com
 * @createDate 2018年11月13日10:52:32
 * @author BoBo update
 */
import axios from "axios";
import { Message, MessageBox } from "element-ui"; // eslint-disable-line

// axios详细配置参考：
// https://github.com/axios/axios#request-config

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:3000/', // 后端接口根路径
  timeout: 60 * 1000, // 请求超时时间
});

// 拦截请求
service.interceptors.request.use(
  (config) => {
    config.headers.auth = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwidXNlcklEIjoiMDAwMDAwMDAtMTAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiZGVwdElEIjoiMmY4NDQ3ZGUtNTczMi00ZmE0LTgyODYtOWE3MWI0MWRkMWU3IiwicmVhbE5hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJyb2xlSUQiOiIwMDAwMDAwMC0xMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJyb2xlTmFtZSI6Iui2hee6p-euoeeQhuWRmCIsImRlcHROYW1lIjoi5oC76YOoIiwicm9sZUF1dGhOYW1lIjoiQWRtaW5EYXNoYm9hcmRGb3JBZG1pbixBZG1pbkRhc2hib2FyZCxVc2VycyxSb2xlLEZvcm1EZXNpZ25lcixUYWJsZURlc2lnbmVyLERpY3QsZmxvd0NsdWVJbmZvLEJ1c2luZXNzQWN0Q2x1ZUluZm8sU3lzdGVtLERldlRvb2xzIiwicGhvdG8iOiJkYXRhOmltYWdlL2pwZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFnQUFBUUFCQUFELzJ3QkRBQWdHQmdjR0JRZ0hCd2NKQ1FnS0RCUU5EQXNMREJrU0V3OFVIUm9mSGgwYUhCd2dKQzRuSUNJc0l4d2NLRGNwTERBeE5EUTBIeWM1UFRneVBDNHpOREwvMndCREFRa0pDUXdMREJnTkRSZ3lJUndoTWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qTC93QUFSQ0FCa0FHUURBU0lBQWhFQkF4RUIvOFFBSHdBQUFRVUJBUUVCQVFFQUFBQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkFBQWdFREF3SUVBd1VGQkFRQUFBRjlBUUlEQUFRUkJSSWhNVUVHRTFGaEJ5SnhGREtCa2FFSUkwS3h3UlZTMGZBa00ySnlnZ2tLRmhjWUdSb2xKaWNvS1NvME5UWTNPRGs2UTBSRlJrZElTVXBUVkZWV1YxaFpXbU5rWldabmFHbHFjM1IxZG5kNGVYcURoSVdHaDRpSmlwS1RsSldXbDVpWm1xS2pwS1dtcDZpcHFyS3p0TFcydDdpNXVzTER4TVhHeDhqSnl0TFQxTlhXMTlqWjJ1SGk0K1RsNXVmbzZlcng4dlAwOWZiMytQbjYvOFFBSHdFQUF3RUJBUUVCQVFFQkFRQUFBQUFBQUFFQ0F3UUZCZ2NJQ1FvTC84UUF0UkVBQWdFQ0JBUURCQWNGQkFRQUFRSjNBQUVDQXhFRUJTRXhCaEpCVVFkaGNSTWlNb0VJRkVLUm9iSEJDU016VXZBVlluTFJDaFlrTk9FbDhSY1lHUm9tSnlncEtqVTJOemc1T2tORVJVWkhTRWxLVTFSVlZsZFlXVnBqWkdWbVoyaHBhbk4wZFhaM2VIbDZnb09FaFlhSGlJbUtrcE9VbFphWG1KbWFvcU9rcGFhbnFLbXFzck8wdGJhM3VMbTZ3c1BFeGNiSHlNbkswdFBVMWRiWDJObmE0dVBrNWVibjZPbnE4dlAwOWZiMytQbjYvOW9BREFNQkFBSVJBeEVBUHdEM2FpaWlnQXFock9zMk9nNlpMcUdvVENPQ1A4U3g3S0IzSnEvMEdUWGdIeFQ4U2pXL0VmMk8xdUZsc0xKUXFHTnNxN2taWnNqcjZmZ2FBSlBFUHhaMXZWSlhqMHh2N090ZWcyWU1yRDNidCtHUHFhNG02MU8vdldMWGQ3Y3pzZXBsbFp2NW1xdEZNa2Nranh0dWpkbFBxcHhXenAzakR4RHBUcWJUVjd0UVA0SGtMcC8zeTJSV0pSUUI3ZDRNK0swV3JYTVduYTNISGJYTWhDeDNDY1J1ZXdJUDNUK24wcjAydmtTdnBINGVhNCt2ZUQ3U2FlVGZjdzVnbUpPU1N2UW42akg2MGhvNnFpaWlnWVVVVVVBRkZGRkFITC9FVzhsc2ZBV3F6UXNWY3hySGtkZzdxcC9RbXZteXZwbngzWm0vOERhdkFveXd0eklCL3VFUC93Q3kxNDc4T2ZER25hMWVYV282ek5ISHB0aHRMckk0UlhaczRCUHB3ZnJ4VEV6bDlPMFRWZFdKR242ZmMzSUJ3VEZFV0ErcDZDdG4vaFhYaTNadi9zV2JIKyttZnl6bXZkN2Z4Rm9VVnVrZG5JZnM2akNmWnJXUm93UFlxdU1VNGVML0FBN3YyUHJGcEUvOTJhUVJuOG14U0N4ODFYK2s2anBVZ2oxQ3h1TFZqMEUwWlhQMHoxcW5YMDdlK0lmQ2wxYlBCZWF0cEU4REQ1bzVMaU53Znd6WG5lc2VCL0NHcHlHZlJkVXVMYmR6c2l0WkxpTDhNREkvTTB3c2VUVjJud3MxR2V5OGRXY01ic0lyb1BGS3VlQ05wSS9JZ2ZyWFFlSC9BSVo2RGRYNGl2UEVTWE1pOG16alR5WkNQY01kMlBvUHhyRCtGZGcwL3dBUWJkc1pGcEhMSTMvZkpYK2JDZ0Q2RG9vb3BEQ2lpaWdBb29vb0F6UEVnbFBoZlZoQm56dnNjMnpIWE93NHJ4end6NFRqdC9pQllXZHk2M09teUt0MUVHT1JJR2pkMHlPaHh0UDVlOWU3RUFqQkdRYTgvUGhuK3pQRmx2YlIzakxiM0VESFQyMkF0YXlSTnZDZjdTNGtrR0QvQUE1SHZRQjZBT0JnZEs1angvcDlwcUhoRzhXNGdTU1lLQmJFajVoS1dBVUE5ZVNRUHhxLzlyMTZJYkgwcTFtY2Y4dElyc3FyZStDdVI5T2ZxYVpEcGwvZlg4TjVyTWtBVzNiZkJaMjVKalIvNzdNUUM3RFBIQUE5TTgwQVlMK0VkRDAveHJvekpwZHRGQzF2TUZBWDVXbVhZVnlEMU8zZVI5UGF1NXFscW1tUmFyYUNGNUhpa1J4SkROSDk2SngwWWY1NUJJNzFTam44Uld3RWM5alozdU9CUERPWWkzdVVaVGo4R05BR1A4UzlLaTFEd3NaVlZWdm9aNFJiU2pobFpwRlhBUFhIemZwN1Z5M3dxMFM0MHZXa3VaWlF4dmROTnd5RCtCVElvVEo5VGhqWFcrSkJmdG9sMXFHcEpEQ2xyR3pXMXBDNWZkTVJ0UXV4QTZGaGhRT3ZPVGdWbytGL0R2OEF3ajlnRm1uTnhlUEhHa2t1M2FBcUx0UkZIWlFQekpKNzBDTjJpaWlnWVVVVVVBRkZGRkFCV040bHNiaTYwMUxteVhkZldNcTNWdXY5OWw2cC93QUNVc3Y0MXMwVUFWZE4xQzMxWFRvTDYxYmRETXU1YzlSNmcraEI0STlSVnF1TWxtdXROOFYzUytIclkza08zenRTdFE0VlVrT01HTW5nU0VaSlhvUUFlQ2F0M1h4QzhPV051WHZMdVMzblg3MXJMQ3l6QStoWEg2OVBlZ0RxS0s0VFRmaTE0WnY1ekZNOXpaZjNYdUl4dGI4Vkp4K05YOVI4VFgyb1dFLy9BQWl0bEplRlVKTjR5N1loL3dCYzkyUE1iMEE0ejFQYWdDeHFUZjIzNGt0TkpqK2Eyc0hXN3ZXN2J4L3FvL3JuNWlQUlI2MTBsWS9oaUhUNDlEaGwwNlZwNDU4eXlUeUhNa3NoKzh6L0FPMW5nanRqSGF0aWdBb29vb0FLS0tLQUN1TzEzNG1lSE5Fa2FIN1ExN2NMd1k3VUJnRDd0bkg2bXVYK0xuaSs0dFpFOFAyRXJSNzR3OTA2bkJJUFJNOXVPVDlSNzE0N1FLNTZwZjhBeHN2WEpHbjZSYnhEczA4aGtQNURiWE5haDhUZkZlb0tVL3RIN01oL2h0a0NmK1BmZS9XdVFvcGdlbi9DcnhtYlBVNU5HMUdZdEhleWI0cG5PU0pqMko3N3NEOGZyWFdlSi9EMW40KzFyN05Bb2lUVHcwYytvcU1rdmppSlIwYkJPVzlPZzVKcndVRXF3WlNRUnlDTzFlbmZEZjRpUjZVaWFMckRoYlFzVERjbi9sbVNja043RW5yMituUUF0d2ZCcWUwaWx1WmIyRzltaUllSzFDRkVtQU9Tck5uSXlNampvVDFydE5UOGE2Wm8vZzBhcGJvcXNCNUVObXcyc2tvNDh0bDdiY2Mrdzl4V2g0azhXNlo0WjByN1pjekxJOGk1Z2hSZ1dtUGJIdDc5SytjdGIxbTYxM1ZialVMb3FIbWN1VVFZVmVBT0I5QUJucWNVZ0xWbjR1MS9UN3llNnROVW5pa25rYVdRQTVSbUp5VHRQSDZWMDlsOFl2RWR2Z1hNVmxkcjNMeGxHL05TQitsZWUwVXhIdGVtZkduVFptVk5UMDJlMXp3WGhjU0w5U09EL092UWRKMXJUZGN0ZnRPbVhrVnpGMzJIbGZZanFEOWErVTYwdEQxeSs4UGFwRmYyRXBTUkQ4eTUrV1JlNnNPNE5BN24xVFJWTFNOU2gxblNMVFVZT0k3aUlTQUgrSFBVZmdjajhLS1F6NXU4WjM1MUx4bHExeVNTRGNzaS93QzZwMmo5QUt3cXQ2bEZjSmZ6dmN3U3dzOGpOaVJDcDVPZTlWS1pJVVVVVUFGRkZGQUNsaTJNa25Bd005cVNpaWdBb29vb0FLS0tNWk9CUUI3ajhLZGRoajhHZlpybVRhYmU1ZEVIK3lRRy9teG9yenJRUDdWdE5QWkl0T3ZYUnBDd0tRTVFlQjZEMm9wRFBveVNLT1pDa3FLNm5xckRJckp1dkNQaDI4eVo5RXNHWTlXRUNxZnpBelJSUU14N2o0VytFWjg0MDFvU2U4YzdqOUNTS3h0UStFSGh5S0I1WTdqVVVJSFFTb1IrcTBVVUNPQzFUd2hwOWl6Q0thNU9QN3pML3dERTF5MTNhcEE1Q0ZqajFvb3BnUVJJSGZCeitGYjJuYUJhM1pIbVNURFA5MGovQUFvb29BN3JSUGhkb2Vvak0xMXFBOWxrUWY4QXNsZExCOEkvQ2tKK2VDNm4vd0N1azVIL0FLRGlpaWtCclczZ0R3cGFmNnZSTFp2K3V1WlAvUWlhMmJYU3RQc1FQc2xoYTIrT25sUXF2OGhSUlFNdDBVVVVBZi9aIiwiaWF0IjoxNjAzMDkxOTcxLCJleHAiOjE2MDMxNzgzNzF9.QfXqO69LbHJre6_04zvOgvzIPjPQLJ6l-CRX5SZvEwY'
    return config;
  },
  (error) => {
    // 请求出错
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    Promise.reject(error);
  }
);

// 拦截响应
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // let { data } = res;
    const { message, code } = res;
    // 600表示token异常需要重新登录
    if (code === 600) {
      Message({
        message: "token已过期",
        type: "error",
        duration: 1000,
      });
      window.location.reload(); // 为了重新实例化vue-router对象，避免bug
    } else if (code === 500) {
      // 极端情况服务器错误
      MessageBox.alert(
        `状态码：500<br>接口：${response.request.responseURL}<br>原因：${message}`,
        "请截图并联系运维人员",
        {
          confirmButtonText: "我知道了",
          type: "warning",
          dangerouslyUseHTMLString: true,
          customClass: "msgBox",
          showClose: true,
        }
      );
    } else if (code === 400) {
      // 业务失败情况统一拦截
      MessageBox.alert(`原因：${message}`, "操作失败", {
        confirmButtonText: "我知道了",
        type: "warning",
        showClose: true,
      });
    }
    // 正常响应继续传递
    return res;
  },
  (error) => {
    // http状态码200以外的情况
    if (process.env.NODE_ENV !== "test") {
      // 请检查网络链接或联系管理员
      const msg = "请检查网络链接或联系管理员。";
      MessageBox.alert(`${error.message}，${msg}`, "网络异常", {
        confirmButtonText: "重试",
        type: "warning",
      }).then(() => {
        // 清空token
        window.location.reload(); // 为了重新实例化vue-router对象，避免bug
      });
    }
    return Promise.reject(error);
  }
);

export default service;
