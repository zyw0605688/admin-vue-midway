import {Provide} from '@midwayjs/core';
import {NewResponse} from "../../utils/response.js";

@Provide()
export class UserService {
  async getUserInfo(id: string) {
    const data = {
      id,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
    return Math.random() > 0.5 ? data : NewResponse(101, data, "特别处理")
  }

  async login(username: string, password: string) {
    return {
      uid: "6645-4587-6345-aa84",
      username: username,
      password: password,
      phone: '12345678901',
      email: password,
      role: "admin"
    };
  }
}
