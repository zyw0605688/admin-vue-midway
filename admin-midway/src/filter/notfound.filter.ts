import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = 200;
    return {
      code: 404,
      data: {},
      msg: "url不存在，请检查!",
    };
  }
}
