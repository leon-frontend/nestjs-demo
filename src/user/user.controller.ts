import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  // NotFoundException,
  // HttpException,
  // HttpStatus,
  // UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import type { GetUserDto } from './dto/get-user.dto';
// import { ConfigService } from '@nestjs/config';
// import { configEnum } from 'src/enum/config.enum';

@Controller('user')
@UseFilters(new TypeormFilter()) // 使用 TypeormFilter 过滤器处理异常
export class UserController {
  // 实例化日志对象(不要使用依赖注入)，参数为当前 controller 的名称，用于区别日志
  private userLogger = new Logger(UserController.name);
  // 在 controller 中使用 service 文件
  constructor(
    private userService: UserService, // 声明 userService
    // private configService: ConfigService, // 获取配置文件的 Service 对象
  ) {
    // 只需要在 constructor 中声明 service，不需要再 new 出来，nestjs 会自动注入
    // this.userService = new UserService();

    this.userLogger.log('user.controller: Init'); // 测试 userLogger
  }

  @Get() // 获取所有用户
  getUsers(@Query() query: GetUserDto): any {
    // todo 读取配置文件中的环境变量
    // console.log('DB: ', this.configService.get(configEnum.DB)); // 获取配置文件中的环境变量
    // console.log('user.controller DB_PORT: ', this.configService.get('DB_PORT')); // 获取 .env 公共配置文件中的公共环境变量
    // console.log('YAML_DB: ', this.configService.get('db'));

    // todo 使用异常过滤器处理异常
    // const isAdmin = false;
    // if (!isAdmin) throw new HttpException('用户禁止访问', HttpStatus.FORBIDDEN); // 403
    // if (!isAdmin) throw new NotFoundException('用户不存在'); // 自动设置状态码 404
    // if (!isAdmin) throw new UnauthorizedException('user.controller.ts 文件: 用户没有权限'); // 自动设置状态码 401

    // todo 测试 userLogger
    this.userLogger.log('请求 getUsers 成功');

    // todo 分页查询用户数据
    // page - 页码，limit - 每页数量，conditions - 查询条件(username, role, gender)，sort - 排序
    // 前端传递的所有 Query 参数类型都为 string
    console.log('🚀 ~ UserController ~ getUsers ~ query:', query);
    return this.userService.findAll(query);
  }

  @Post() // 添加单个用户
  addUser(@Body() dto: any): any {
    // @Body() 装饰器用于提取HTTP请求体中的数据。dto 是参数名，代表 Data Transfer Object（数据传输对象）
    const user = dto as User;
    return this.userService.create(user);
  }

  @Get('/logs') // 实现 User 表和 Logs 表的一对多关联查询
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  // '/profile' 的代码位置不能放在 '/:id' 下面，否则 profile 会作为 :id 的值先与 '/:id' 进行匹配
  @Get('/profile') // 实现 User 表和 Profile 表的一对一关联查询
  getUserProfile(@Query() query: any): any {
    console.log('🚀 ~ UserController ~ getUserProfile ~ query:', query);
    return this.userService.findProfile(2);
  }

  @Get('/:id') // 获取单个用户
  getUser() {
    return 'hello world';
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() dto: any): any {
    // @Body 装饰器用于提取请求体中的数据；@Param 装饰器用于提取路由中的动态参数
    const user = dto as User;
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    return this.userService.remove(id);
  }
}
