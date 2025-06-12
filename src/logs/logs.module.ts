import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './logs.entity';

@Module({
  // 将 Logs 实体注册到当前模块。然后，NestJS 会自动创建 LogsRepository（用于操作 Logs 表的工具），可以在 Service 中通过依赖注入使用。
  imports: [TypeOrmModule.forFeature([Logs])],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
