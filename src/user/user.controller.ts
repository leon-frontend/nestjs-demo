import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
// import { configEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  // 在 controller 中使用 service 文件
  constructor(
    private userService: UserService, // 声明 userService
    private configService: ConfigService, // 获取配置文件
  ) {
    // 只需要在 constructor 中声明 service，不需要再 new 出来，nestjs 会自动注入
    // this.userService = new UserService();
  }
  @Get()
  getUsers(): any {
    // console.log('DB: ', this.configService.get(configEnum.DB)); // 获取配置文件中的环境变量
    // console.log('DB_URL: ', this.configService.get('DB_URL')); // 获取 .env 公共配置文件中的公共环境变量
    console.log('YAML_DB: ', this.configService.get('db'));
    return this.userService.getUsers();
  }

  @Post()
  addUser(): any {
    return this.userService.addUser();
  }
}
