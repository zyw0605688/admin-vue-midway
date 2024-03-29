import {Inject, Provide} from '@midwayjs/core';
import {NewResponse} from "../../utils/response.js";
import {DataSource} from 'typeorm';
import {InjectDataSource} from "@midwayjs/typeorm";
import {UserEntity} from "../../entity/user.entity.js";
import {JwtService} from "@midwayjs/jwt";

@Provide()
export class UserService {
  @InjectDataSource()
  defaultDataSource: DataSource;

  @Inject()
  jwtService: JwtService;

  async create(data) {
    return await this.defaultDataSource.getRepository(UserEntity).save(data)
  }

  // 批量删除，参数是数组形式的id列表
  async deleteByIds(idList) {
    return await this.defaultDataSource.getRepository(UserEntity).softDelete(idList)
  }

  async update(data) {
    const temp = await this.defaultDataSource.getRepository(UserEntity).findOneBy({id: data.id})
    Object.assign(temp, data)
    return await this.defaultDataSource.getRepository(UserEntity).save(temp)
  }

  async detail(id) {
    return await this.defaultDataSource.getRepository(UserEntity).findOneBy({id})
  }

  async pageList(params) {
    const db = this.defaultDataSource.getRepository(UserEntity).createQueryBuilder()
    const count = this.defaultDataSource.getRepository(UserEntity).createQueryBuilder()
    if (params.page && params.pageSize) {
      db.skip((params.page - 1) * params.pageSize).take(params.pageSize)
    }
    if (params.username) {
      db.andWhere('username LIKE :username', {
        username: `%${params.username}%`,
      })
      count.andWhere('username LIKE :username', {
        username: `%${params.username}%`,
      })
    }
    if (params.email) {
      db.andWhere('email LIKE :email', {
        email: `%${params.email}%`,
      })
      count.andWhere('email LIKE :email', {
        email: `%${params.email}%`,
      })
    }
    const list = await db.getMany()
    const total = await count.getCount()
    return {
      list: list,
      total: total,
      page: Number(params.page),
      pageSize: Number(params.pageSize)
    }
  }

  async getUserInfo(id: string) {
    const data = {
      id,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
    return Math.random() > 0.5 ? data : NewResponse(101, data, "特别处理")
  }

  async login(data) {
    const res = await this.defaultDataSource.getRepository(UserEntity).findOneBy(data)
    if (!res) {
      return NewResponse(101, "", "用户名密码不正确")
    }
    const payload = {
      id: res.id,
      username: res.username,
      role: "admin"
    }
    const token = await this.jwtService.sign(payload);
    return {
      user_info: res,
      token: token
    }
  }


}
