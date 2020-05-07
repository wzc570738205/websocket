/*
 * @Author: wangzhichiao<https://github.com/wzc570738205>
 * @Date: 2020-03-12 20:16:22
 * @LastEditors: wangzhichiao<https://github.com/wzc570738205>
 * @LastEditTime: 2020-05-07 14:17:04
 */
import request from "../utils/request";
/**登录服务 */
var service = {
  /**
   * @description: 登录接口
   * 目录查询-服务-订阅方式下拉列表框-接口调用选项
   * @param {type}
   * @return:
   */
  postImg(url,param) {
    return request({
      url: url,
      method: "post",
      data: param,
      headers: { showLoading: false }
    });
  },
};
export { service };
