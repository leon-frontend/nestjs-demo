import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  // 在 controller 中使用 service 文件
  constructor(private userService: UserService) {
    // 只需要在 constructor 中声明 service，不需要再 new 出来，nestjs 会自动注入
    // this.userService = new UserService();
  }
  @Get()
  getUsers(): any {
    return this.userService.getUsers();
  }

  @Post()
  addUser(): any {
    return this.userService.addUser();
  }
}
