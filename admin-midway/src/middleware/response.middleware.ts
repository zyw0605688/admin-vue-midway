import {IMiddleware} from '@midwayjs/core';
import {Middleware} from '@midwayjs/decorator';
import {NextFunction, Context} from '@midwayjs/koa';

@Middleware()
export class ResponseMiddleware implements IMiddleware<Context, NextFunction> {

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const data = await next();
      return {
        code: data['code'] || 200,
        msg: data['msg'] || '操作成功',
        data: data['data'] || data,
      }
    };
  }
}
