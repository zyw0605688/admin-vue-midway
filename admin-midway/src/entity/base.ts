import {CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export class BaseDB {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  create_at: string;

  @UpdateDateColumn()
  update_at: string;

  @DeleteDateColumn()
  delete_at: string;
}
