import {Inject, Middleware, httpError} from '@midwayjs/core';
import {Context, NextFunction} from '@midwayjs/koa';
import {JwtService} from '@midwayjs/jwt';

@Middleware()
export class JwtMiddleware {
  @Inject()
  jwtService: JwtService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError();
      }
      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ');

      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError();
      }

      const [scheme, token] = parts;

      if (/^Bearer$/i.test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          const res = await this.jwtService.verify(token, {
            complete: true,
          });
          // 将这些信息放到ctx上，后面接口里，可直接使用
          ctx.user_id = res["payload"].id
          ctx.username = res["payload"].username
          ctx.role = res["payload"].role
        } catch (error) {
          //token过期 生成新的token
        }
        await next();
      }
    };
  }

  // 配置忽略鉴权的路由地址
  public match(ctx: Context): boolean {
    const ignore = ctx.path.indexOf('/v1/user/login') !== -1;
    return !ignore;
  }
}
