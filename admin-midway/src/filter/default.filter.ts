import {Catch} from '@midwayjs/core';
import {Context} from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    ctx.status = 200;
    return {
      code: err["code"] || 20000,
      data: err["data"] || '',
      msg: err.message,
    };
  }
}
