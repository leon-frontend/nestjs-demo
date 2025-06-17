// todo: 通过设计实体类来设计数据库表
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() // 主键（自增列）
  id?: number;

  @Column({ unique: true }) // 列，唯一索引
  username: string;

  @Column() // 列
  password: string;

  // 一对一关系：一个用户拥有一个个人资料。cascade 属性表示级联保存、更新、删除操作。
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile?: Profile;

  // 一对多关系：一个用户拥有多个日志，会在"被拥有"的表中创建外键字段。
  // 第二个参数解析：表示从 A 实体如何找到 B 实体中对应的关联属性。当我从 User 查找关联的 Logs 时，通过 Logs 实体中的 user 属性来建立反向连接
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[]; // 数组类型，表示多个日志

  // 多对多关系：一个用户拥有多个角色，一个角色对应多个用户
  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({ name: 'users_roles' }) // 建立多对多关联的中间表，命名为 user_roles
  roles: Roles[];

  @AfterInsert() // 该钩子函数会在插入数据后执行
  afterInsert() {
    console.log('🚀 ~ User ~ afterInsert ~ afterInsert');
  }

  @AfterRemove() // 该钩子函数会在删除数据后执行
  afterRemove() {
    console.log('🚀 ~ User ~ afterRemove ~ afterRemove');
  }
}
