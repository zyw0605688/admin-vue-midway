import {Configuration, App} from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as orm from '@midwayjs/typeorm';
import * as jwt from '@midwayjs/jwt';
import {ResponseMiddleware} from './middleware/response.middleware.js';
import {JwtMiddleware} from './middleware/jwt.middleware.js';
import {DefaultErrorFilter} from './filter/default.filter.js';
import {NotFoundFilter} from './filter/notfound.filter.js';
import DefaultConfig from './config/config.default.js';

@Configuration({
  imports: [
    koa,
    validate,
    orm,
    jwt,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    this.app.useMiddleware([JwtMiddleware, ResponseMiddleware]);
    this.app.useFilter([DefaultErrorFilter, NotFoundFilter]);
  }
}
