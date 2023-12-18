import { BasePort } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 登录模块
 */
// 用户登录
export const GetIsInited = () => {
  return http.get(BasePort + `/getIsInited`);
};
