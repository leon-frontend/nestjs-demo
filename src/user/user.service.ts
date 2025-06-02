import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  // todo: 获取用户数据
  getUsers() {
    return {
      code: 200,
      msg: '获取用户数据成功',
      data: [1, 2, 3],
    };
  }

  // todo: 新增用户数据
  addUser() {
    return {
      code: 200,
      msg: '新增用户数据成功',
      data: {},
    };
  }
}
