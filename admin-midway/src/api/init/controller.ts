import { Controller, Get } from '@midwayjs/core';

@Controller("/api")
export class InitController{

  @Get('/getIsInited')
  async getIsInited() {
    const res = true
    return { code: 0, message: 'OK', data: res };
  }
}
