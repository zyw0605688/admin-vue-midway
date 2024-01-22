import {Entity, Column} from 'typeorm';
import {BaseDB} from "./base.js";

export enum UserSex {
  MALE = "m",
  FEMALE = "F",
  UNKNOWN = "u",
}

@Entity("sys_user")
export class User extends BaseDB {
  @Column({nullable:true, unique: true})
  username: string;

  @Column()
  password: string;

  @Column({nullable:true,unique: true})
  email: string;

  @Column({
    nullable:true,
    type: "enum",
    enum: UserSex,
    default: UserSex.UNKNOWN
  })
  sex: UserSex;

  @Column({nullable:true,unique: true})
  phone: string;

  @Column({nullable:true})
  nickname: string;

}
