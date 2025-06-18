import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { In, Repository } from 'typeorm';
import { Roles } from '../roles/roles.entity';
import type { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    // 使用 @InjectRepository() 装饰器将 UsersRepository（用于操作 User 表的工具）注入到 UsersService 中
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  // 查询所有数据
  findAll(query: GetUserDto): Promise<User[]> {
    // 解构 Query 参数，并设置默认值
    const { limit = 10, page = 1, roleId, gender, username } = query;

    /*
      原生 SQL 语句:
        SELECT * FROM user u 
        LEFT JOIN profile p ON u.id = p.uid
        LEFT JOIN roles r ON u.id = r.uid
        WHERE ...
        LIMIT ...
        OFFSET ...
    */
    return this.userRepository.find({
      // 字段筛选：select 属性表示需要查询哪些字段
      select: {
        id: true,
        username: true,
        // profile: {
        //   gender: true, // profile 表只展示 gender 字段
        // },
      },
      relations: ['profile', 'roles'],
      take: limit, // take 属性对应 SQL 中的 LIMIT
      skip: (page - 1) * limit, // skip 属性对应 SQL 中的 OFFSET
      where: {
        profile: {
          gender,
        },
        roles: {
          id: roleId,
        },
        username,
      },
    });
  }

  // 根据条件进行查询
  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  // 创建新的 User 数据
  async create(user: User) {
    // 由于前端传递的数据是 roleId，因此需要先查询出对应的 role name
    if (user.roles instanceof Array) {
      user.roles = await this.rolesRepository.find({
        where: { id: In(user.roles) },
      });
    }

    const userTemp = this.userRepository.create(user);
    return this.userRepository.save(userTemp);
  }

  // 更新用户时只需要提供要修改的字段, Partial<User> 表示 User 对象的部分属性，即所有属性都变成可选的。
  async update(id: number, user: Partial<User>) {
    // 使用 Repository 的 update 方法只能更新单个 User 模型中的数据
    // return this.userRepository.update(id, user);

    // 更新 User 模型中的 Profile 模型（关联模型）中的数据
    const userTemp = await this.findProfile(id); // 查询用户的 Profile 信息
    if (!userTemp) throw new NotFoundException('用户不存在');
    const newUser = this.userRepository.merge(userTemp, user); // 合并两个对象
    return this.userRepository.save(newUser); // 使用 save 方法更新数据
  }

  // 删除某个 User 数据
  async remove(id: number) {
    // return this.userRepository.delete(id); // 根据 id 数据删除数据
    const user = await this.userRepository.findOne({ where: { id } });

    // 检查 user 是否存在
    if (!user) {
      // 如果用户不存在，抛出一个标准的“未找到”异常。http-exception 会对其捕获
      throw new NotFoundException(`ID 为 "${id}" 的用户未找到。`);
    }

    return this.userRepository.remove(user);
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
