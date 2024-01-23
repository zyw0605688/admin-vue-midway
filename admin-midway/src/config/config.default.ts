import { MidwayConfig } from '@midwayjs/core';


export default {
  keys: '1702884100302_7933',
  koa: {
    port: 7001,
    globalPrefix: '/v1'
  },
  typeorm: {
    dataSource: {
      default: {
        type: "postgres",
        host: "172.16.66.26",
        port: 55433,
        username: "root",
        password: "123456",
        database: "midway_vue_admin",
        synchronize: true,
        logging: true,
        entities: [
          '**/entity/*.entity{.js,.ts}'
        ]
      }
    }
  },
  jwt: {
    secret: 'zyw0605688',
    sign: {
      expiresIn: '8h',
    },
    verify: {
    },
    decode: {
    }
  },
} as MidwayConfig;
