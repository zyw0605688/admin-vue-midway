import {Inject, Controller, Get, Query, Post, Body} from '@midwayjs/core';
import {Context} from '@midwayjs/koa';
import {UserService} from './user.service.js';

@Controller()
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  service: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid) {
    const user = await this.service.getUser({uid});
    return {success: true, message: 'OK', data: user};
  }

  @Post('/login')
  async login(@Body() username: string, password: string) {
    return await this.service.login(username, password);
  }
}
