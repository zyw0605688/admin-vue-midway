import {Provide} from '@midwayjs/core';
import {IUserOptions} from '../../interface.js';

@Provide()
export class UserService {
  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }

  async login(username: string, password: string) {
    return {
      uid: "6645-4587-6345-aa84",
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
