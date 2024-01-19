import {Inject, Controller, Get, Query, Post, Body} from '@midwayjs/core';
import {Context} from '@midwayjs/koa';
import {UserService} from './user.service.js';

@Controller()
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  service: UserService;

  @Get('/getUserInfo')
  async getUser(@Query('id') id) {
    return await this.service.getUserInfo(id);
  }

  @Post('/login')
  async login(@Body() req) {
    const {username, password} = req
    return await this.service.login(username, password);
  }
}
