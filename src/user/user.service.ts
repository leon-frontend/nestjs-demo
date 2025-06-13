import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    // 使用 @InjectRepository() 装饰器将 UsersRepository（用于操作 User 表的工具）注入到 UsersService 中
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 查询所有数据
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // 根据条件进行查询
  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  // 创建新的 User 数据
  create(user: User) {
    const userTemp = this.userRepository.create(user);
    return this.userRepository.save(userTemp);
  }

  // 更新用户时只需要提供要修改的字段, Partial<User> 表示 User 对象的部分属性，即所有属性都变成可选的。
  update(id: number, user: Partial<User>) {
    // update 方法需要传递查询的参数，以及更新后的 User 类型的对象
    return this.userRepository.update(id, user);
  }

  // 删除某个 User 数据
  remove(id: number) {
    return this.userRepository.delete(id);
  }

  // todo: 实现一对一的关联查询
  findProfile(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: { profile: true }, // 开启关联查询
    });
  }

  // todo: 实现一对多的关联查询，查询某个用户拥有的所有日志信息
  findUserLogs(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: { logs: true }, // 开启关联查询
    });
  }
}
