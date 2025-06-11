import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: number;

  @Column()
  photo: string;

  @Column()
  address: string;

  // 建立一对一依赖关系
  @OneToOne(() => User) // 返回依赖的实体类（数据表）。返回函数形式可以避免循环依赖问题，延迟加载实体类型
  @JoinColumn() // 创建关联字段（外键字段）。默认通过 userId 字段名关联 user 表。
  // @JoinColumn({ name: 'uid' }) // 可以使用 name 属性自定义关联字段名称。
  user: User; // 通过 user 属性可以访问关联的 User 对象的所有数据
}
