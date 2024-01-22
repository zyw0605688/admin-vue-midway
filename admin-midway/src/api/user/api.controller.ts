import {Inject, Controller, Get, Query, Post, Del, Body} from '@midwayjs/core';
import {Context} from '@midwayjs/koa';
import {UserService} from './user.service.js';

export type loginParams = {
  password: string,
  username?: string,
  phone?: string,
  email?: string,
}

@Controller("/user")
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  service: UserService;

  @Post('/create')
  async create(@Body() req) {
    console.log(req)
    return await this.service.create(req);
  }

  @Del('/delete')
  async delete(@Query("ids") ids) {
    console.log("ids",ids)
    const idList = ids.split(",")
    console.log(idList)
    return await this.service.deleteByIds(idList);
  }

  @Post('/update')
  async update(@Body() req) {
    return await this.service.update(req);
  }

  @Get('/detail')
  async detail(@Query("id") id) {
    console.log(id)
    return await this.service.detail(id);
  }

  @Get('/list')
  async list(@Query() req) {
    return await this.service.pageList(req);
  }

  @Get('/getUserInfo')
  async getUser(@Query('id') id) {
    return await this.service.getUserInfo(id);
  }

  @Post('/login')
  async login(@Body() req) {
    const params: loginParams = {
      password: req.password,
    }
    if (req.username) {
      params.username = req.username
    }
    if (req.phone) {
      params.phone = req.phone
    }
    if (req.email) {
      params.email = req.email
    }
    return await this.service.login(params);
  }

}
