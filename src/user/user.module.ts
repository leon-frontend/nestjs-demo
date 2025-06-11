import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  // 将 User 实体注册到当前模块。然后，NestJS 会自动创建 UserRepository（用于操作 User 表的工具），可以在 Service 中通过依赖注入使用。
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
