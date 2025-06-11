import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
// import { ConfigService } from '@nestjs/config';
// import { configEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  // 在 controller 中使用 service 文件
  constructor(
    private userService: UserService, // 声明 userService
    // private configService: ConfigService, // 获取配置文件的 Service 对象
  ) {
    // 只需要在 constructor 中声明 service，不需要再 new 出来，nestjs 会自动注入
    // this.userService = new UserService();
  }
  @Get()
  getUsers(): any {
    // console.log('DB: ', this.configService.get(configEnum.DB)); // 获取配置文件中的环境变量
    // console.log('user.controller DB_PORT: ', this.configService.get('DB_PORT')); // 获取 .env 公共配置文件中的公共环境变量
    // console.log('YAML_DB: ', this.configService.get('db'));
    return this.userService.findAll();
  }

  @Post()
  addUser(): any {
    const user: User = {
      username: 'abc',
      password: '123456',
      roles: [],
      logs: [],
    };
    return this.userService.create(user);
  }
}
