import axios from "axios";
import { Message } from "element-ui";
// create an axios instance
const service = axios.create({
  //baseURL: '',//process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 99999999, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    //判断当前请求是否设置了不显示Loading

    // do something before request is sent

    return config;
  },
  (error) => {
    //判断当前请求是否设置了不显示Loading
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;

    return res;
  },
  (err) => {
    let message = "";
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          message = "请求错误(400)";
          break;
        case 401:
          message = err.response.data;
          break;
        case 403:
          message = "拒绝访问(403)";
          break;
        case 404:
          message = "请求出错(404)";
          break;
        case 408:
          message = "请求超时(408)";
          break;
        case 500:
          message = "服务器错误(500)";
          break;
        case 501:
          message = "服务未实现(501)";
          break;
        case 502:
          message = "网络错误(502)";
          break;
        case 503:
          message = "服务不可用(503)";
          break;
        case 504:
          message = "网络超时(504)";
          break;
        case 505:
          message = "HTTP版本不受支持(505)";
          break;
        default:
          message = `连接出错(${err.response.status})!`;
      }
    } else {
      message = "连接服务器失败!";
    }

    Message({
      message: message,
      type: "error",
      duration: 5 * 1000,
    });

    return Promise.reject(err.response);
  }
);

export default service;
