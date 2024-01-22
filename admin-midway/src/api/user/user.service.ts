import {Provide} from '@midwayjs/core';
import {NewResponse} from "../../utils/response.js";
import {DataSource} from 'typeorm';
import {InjectDataSource} from "@midwayjs/typeorm";
import {User} from "../../entity/user.entity.js";

@Provide()
export class UserService {
  @InjectDataSource()
  defaultDataSource: DataSource;

  async create(data) {
    return await this.defaultDataSource.getRepository(User).save(data)
  }

  // 批量删除，参数是数组形式的id列表
  async deleteByIds(idList) {
    return await this.defaultDataSource.getRepository(User).softDelete(idList)
  }

  async update(data) {
    const temp = await this.defaultDataSource.getRepository(User).findOneBy({id: data.id})
    Object.assign(temp, data)
    return await this.defaultDataSource.getRepository(User).save(temp)
  }

  async detail(id) {
    return await this.defaultDataSource.getRepository(User).findOneBy({id})
  }

  async pageList(params) {
    const db = this.defaultDataSource.getRepository(User).createQueryBuilder()
    const count = this.defaultDataSource.getRepository(User).createQueryBuilder()
    if (params.page && params.pageSize) {
      db.skip((params.page - 1) * params.pageSize).take(params.pageSize)
    }
    if (params.username) {
      db.where({username: params.username})
      count.where({username: params.username})
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
    console.log(data)
    return null
  }


}
