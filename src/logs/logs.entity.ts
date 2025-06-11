import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  data: string;

  @Column()
  result: string;

  // 多对一关系：多个日志对应一个用户
  // 第二个参数解析：表示从 A 实体如何找到 B 实体中对应的关联属性。当我从 Logs 查找关联的 User 时，通过 User 实体中的 logs 属性来建立反向连接
  @ManyToOne(() => User, (user) => user.logs)
  // 注意，在 Logs 表（"多"的一方）中需要创建外键字段
  @JoinColumn() // 指定关联字段，默认值为 userId
  user: User;
}
