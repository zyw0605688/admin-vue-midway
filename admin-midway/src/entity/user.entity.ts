import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';

export enum UserSex {
  MALE = "m",
  FEMALE = "F",
  UNKNOWN = "u",
}

@Entity("sys_user")
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({
    type: "enum",
    enum: UserSex,
    default: UserSex.UNKNOWN
  })
  sex: UserSex;

  @Column()
  phone: string;

  @Column()
  nickname: string;

  @CreateDateColumn()
  create_at: string;

  @UpdateDateColumn()
  update_at: string;

  @DeleteDateColumn()
  delete_at: string;

}
